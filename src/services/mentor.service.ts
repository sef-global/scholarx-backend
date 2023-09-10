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
