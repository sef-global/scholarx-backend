import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity'
import Profile from '../entities/profile.entity'
import { ApplicationStatus } from '../enums'
import Category from '../entities/category.entity'

export const createMentor = async (user: Profile, application: JSON) => {
  const userId = user.uuid
  const categoryId = '60b5b847-99a2-4e47-b35b-81b4284311dd'

  try {
    const profileRepository = dataSource.getRepository(Profile)
    const userProfile = await profileRepository.findOne({
      where: { uuid: userId }
    })

    if (!userProfile) {
      throw new Error('User profile not found')
    }

    const mentorRepository = dataSource.getRepository(Mentor)
    const existingMentorArray = await mentorRepository.find({
      where: { uuid: userId }
    })

    if (existingMentorArray.length > 0) {
      const pendingMentors = existingMentorArray.filter(
        (existingMentor) => existingMentor.state == ApplicationStatus.PENDING
      )
      if (pendingMentors.length > 0) {
        throw new Error('Application pending')
      } else {
        const categoryRepository = dataSource.getRepository(Category)
        const category = await categoryRepository.findOne({
          where: { uuid: categoryId }
        })

        if (!category) {
          throw new Error('User profile not found')
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
        return newMentor
      }
    } else {
      const categoryRepository = dataSource.getRepository(Category)
      const category = await categoryRepository.findOne({
        where: { uuid: categoryId }
      })

      if (!category) {
        throw new Error('User profile not found')
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
      return newMentor
    }
  } catch (err) {
    console.error('Error creating mentor', err)
    throw new Error('Error creating mentor')
  }
}
