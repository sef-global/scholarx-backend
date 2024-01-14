import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { ApplicationStatus } from '../enums'
import Category from '../entities/category.entity'

export const createMentor = async (
  user: Profile,
  application: JSON,
  categoryId: string
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const categoryRepository = dataSource.getRepository(Category)

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
      user,
      []
    )

    await mentorRepository.save(newMentor)

    return {
      statusCode: 201,
      mentor: newMentor,
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
  updatedMentorApplication?: Mentor
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)
    const existingMentorApplications = await mentorRepository.find({
      where: { profile: { uuid: mentorId } }
    })

    const mentorApplication = existingMentorApplications[0]

    if (mentorApplication) {
      mentorApplication.availability = availability
      const updatedMentorApplication = await mentorRepository.save(
        mentorApplication
      )
      return {
        statusCode: 200,
        updatedMentorApplication,
        message: 'Mentor availability updated sucessfully'
      }
    } else {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }
  } catch (err) {
    console.error('Error creating mentor', err)
    throw new Error('Error creating mentor')
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
      relations: ['profile', 'category', 'mentees']
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

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
  category?: string | null
): Promise<{
  statusCode: number
  mentors?: Mentor[] | null
  message: string
}> => {
  try {
    let mentors: Mentor[] = []
    const mentorRepository = dataSource.getRepository(Mentor)
    if (category == null) {
      mentors = await mentorRepository
        .createQueryBuilder('mentor')
        .leftJoinAndSelect('mentor.profile', 'profile')
        .leftJoinAndSelect('mentor.category', 'category')
        .where('mentor.state = :state', { state: 'approved' })
        .getMany()
    } else {
      mentors = await mentorRepository
        .createQueryBuilder('mentor')
        .leftJoinAndSelect('mentor.profile', 'profile')
        .leftJoinAndSelect('mentor.category', 'category')
        .where('mentor.state = :state', { state: 'approved' })
        .andWhere('category.category = :category', { category })
        .getMany()
    }

    if (!mentors || mentors.length === 0) {
      return {
        statusCode: 404,
        message: 'No mentors found'
      }
    }

    return {
      statusCode: 200,
      mentors,
      message: 'Mentors found'
    }
  } catch (err) {
    console.error('Error getting mentors', err)
    throw new Error('Error getting mentors')
  }
}
