import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { ApplicationStatus } from '../enums'
import Category from '../entities/category.entity'
import { getEmailContent, getMentorPublicData } from '../utils'
import { sendEmail } from './admin/email.service'
import Mentee from '../entities/mentee.entity'

export const createMentor = async (
  user: Profile,
  application: Record<string, unknown>,
  categoryId: string
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const categoryRepository = dataSource.getRepository(Category)
    const menteeRepository = dataSource.getRepository(Mentee)

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

    for (const mentor of existingMentorApplications) {
      switch (mentor.state) {
        case ApplicationStatus.PENDING:
          return {
            mentor,
            statusCode: 409,
            message: 'The mentor application is pending'
          }
        case ApplicationStatus.APPROVED:
          return {
            mentor,
            statusCode: 409,
            message: 'The user is already a mentor'
          }
        default:
          break
      }
    }

    const newMentor = new Mentor(
      ApplicationStatus.PENDING,
      category,
      application,
      true,
      user
    )

    const savedMentor = await mentorRepository.save(newMentor)

    const content = getEmailContent(
      'mentor',
      ApplicationStatus.PENDING,
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
      relations: ['profile', 'category', 'mentees'],
      select: ['application', 'uuid', 'availability']
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    const { application } = mentor
    delete application.cv
    delete application.contactNo
    delete application.email

    return {
      statusCode: 200,
      mentor,
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

export const getAllMentors = async (
  categoryId?: string | null
): Promise<{
  statusCode: number
  mentors?: Mentor[] | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const mentors = await mentorRepository.find({
      where: categoryId
        ? {
            category: { uuid: categoryId },
            state: ApplicationStatus.APPROVED,
            availability: true
          }
        : { state: ApplicationStatus.APPROVED, availability: true },
      relations: ['profile', 'category'],
      select: ['application', 'uuid', 'availability']
    })

    const publicMentors = mentors.map((mentor) => getMentorPublicData(mentor))

    if (!mentors || mentors.length === 0) {
      return {
        statusCode: 200,
        mentors: [],
        message: 'No mentors found'
      }
    }

    return {
      statusCode: 200,
      mentors: publicMentors,
      message: 'Mentors found'
    }
  } catch (err) {
    console.error('Error getting mentors', err)
    throw new Error('Error getting mentors')
  }
}
