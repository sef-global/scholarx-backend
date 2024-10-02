import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'
import { Country } from '../entities/country.entity'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { MentorApplicationStatus } from '../enums'
import { type PaginatedApiResponse } from '../types'
import {
  capitalizeFirstLetter,
  getEmailContent,
  getMentorPublicData
} from '../utils'
import { sendEmail } from './admin/email.service'

export const createMentor = async (
  user: Profile,
  application: Record<string, unknown>,
  categoryId: string,
  countryId: string
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const categoryRepository = dataSource.getRepository(Category)
    const menteeRepository = dataSource.getRepository(Mentee)
    const countryRepository = dataSource.getRepository(Country)

    const mentee = await menteeRepository.findOne({
      where: {
        profile: {
          uuid: user.uuid
        }
      }
    })

    if (mentee) {
      return {
        statusCode: 409,
        message:
          'A mentee cannot become a mentor, Please contact sustainableeducationfoundation@gmail.com'
      }
    }

    const existingMentorApplications = await mentorRepository.find({
      where: { profile: { uuid: user.uuid } }
    })

    const category = await categoryRepository.findOne({
      where: { uuid: categoryId }
    })

    if (!category) {
      return {
        statusCode: 404,
        message: 'Category not found'
      }
    }

    const country = await countryRepository.findOne({
      where: { uuid: countryId }
    })

    if (!country) {
      return {
        statusCode: 404,
        message: 'Country not found'
      }
    }

    for (const mentor of existingMentorApplications) {
      switch (mentor.state) {
        case MentorApplicationStatus.PENDING:
          return {
            mentor,
            statusCode: 409,
            message: 'You have already applied'
          }
        case MentorApplicationStatus.APPROVED:
          return {
            mentor,
            statusCode: 409,
            message: 'The user is already a mentor'
          }
        default:
          break
      }
    }

    application.firstName = capitalizeFirstLetter(
      application.firstName as string
    )
    application.lastName = capitalizeFirstLetter(application.lastName as string)

    const newMentor = new Mentor(
      MentorApplicationStatus.PENDING,
      category,
      application,
      true,
      user,
      country
    )

    const savedMentor = await mentorRepository.save(newMentor)

    const content = await getEmailContent(
      'mentor',
      MentorApplicationStatus.PENDING,
      application.firstName as string
    )

    if (content) {
      await sendEmail(
        application.email as string,
        content.subject,
        content.message
      )
    }

    return {
      statusCode: 201,
      mentor: savedMentor,
      message: 'Mentor application is successful'
    }
  } catch (err) {
    console.error('Error creating mentor', err)
    throw new Error('Error creating mentor')
  }
}

export const updateAvailability = async (
  mentorId: string,
  availability: boolean
): Promise<{
  statusCode: number
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const mentor = await mentorRepository.findOne({
      where: { uuid: mentorId }
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    await mentorRepository.update({ uuid: mentorId }, { availability })

    return {
      statusCode: 200,
      message: 'Mentor availability updated successfully'
    }
  } catch (err) {
    console.error('Error updating mentor availability', err)
    throw new Error('Error updating mentor availability')
  }
}

export const getMentor = async (
  mentorId: string
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const mentor = await mentorRepository.findOne({
      where: { uuid: mentorId },
      relations: ['profile', 'category', 'mentees', 'mentees.profile'],
      select: ['application', 'uuid', 'availability']
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    const publicMentor = getMentorPublicData(mentor)

    return {
      statusCode: 200,
      mentor: publicMentor,
      message: 'Mentor found'
    }
  } catch (err) {
    console.error('Error getting mentor', err)
    throw new Error('Error getting mentor')
  }
}

export const searchMentorsByQuery = async (
  q?: string
): Promise<{
  statusCode: number
  mentors?: Mentor[] | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const query = q ? `${q}%` : ''

    const mentors: Mentor[] = await mentorRepository
      .createQueryBuilder('mentor')
      .innerJoinAndSelect('mentor.profile', 'profile')
      .where(
        'profile.first_name ILIKE :name OR profile.last_name ILIKE :name',
        {
          name: query
        }
      )
      .getMany()

    if (!mentors) {
      return {
        statusCode: 404,
        message: 'Mentors not found'
      }
    }

    return {
      statusCode: 200,
      mentors,
      message: 'All search Mentors found'
    }
  } catch (err) {
    console.error('Error getting mentor', err)
    throw new Error('Error getting mentor')
  }
}

export const getAllMentors = async ({
  categoryId,
  pageNumber,
  pageSize
}: {
  categoryId?: string | null
  pageNumber: number
  pageSize: number
}): Promise<PaginatedApiResponse<Mentor>> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const mentors = await mentorRepository.findAndCount({
      where: categoryId
        ? {
            category: { uuid: categoryId },
            state: MentorApplicationStatus.APPROVED
          }
        : { state: MentorApplicationStatus.APPROVED },
      relations: ['profile', 'category'],
      select: ['application', 'uuid', 'availability'],
      order: {
        availability: 'DESC'
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    })

    const publicMentors = mentors[0].map((mentor) =>
      getMentorPublicData(mentor)
    )

    if (publicMentors.length === 0) {
      return {
        statusCode: 404,
        items: [],
        totalItemCount: 0,
        pageNumber,
        pageSize,
        message: 'No mentors found'
      }
    }

    return {
      statusCode: 200,
      items: publicMentors,
      totalItemCount: mentors[1],
      pageNumber,
      pageSize,
      message: 'Mentors found'
    }
  } catch (err) {
    console.error('Error getting mentors', err)
    throw new Error('Error getting mentors')
  }
}
