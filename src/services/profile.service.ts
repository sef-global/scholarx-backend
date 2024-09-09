import { dataSource } from '../configs/dbConfig'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import Profile from '../entities/profile.entity'
import { type CreateProfile } from '../types'
import { getMentorPublicData } from '../utils'

export const updateProfile = async (
  user: Profile,
  updateData: Partial<Profile>
): Promise<{
  statusCode: number
  profile?: Profile | null
  message: string
}> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)

    const updatedFields: Partial<Profile> = {}

    if (updateData.primary_email)
      updatedFields.primary_email = updateData.primary_email
    if (updateData.first_name) updatedFields.first_name = updateData.first_name
    if (updateData.last_name) updatedFields.last_name = updateData.last_name
    if (updateData.image_url) updatedFields.image_url = updateData.image_url

    await profileRepository.update(
      { uuid: user.uuid },
      updatedFields as CreateProfile
    )

    const savedProfile = await profileRepository.findOneBy({
      uuid: user.uuid
    })

    return {
      statusCode: 200,
      profile: savedProfile,
      message: 'Successfully updated the profile'
    }
  } catch (error) {
    console.error('Error executing login', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}

export const deleteProfile = async (userId: string): Promise<void> => {
  const profileRepository = dataSource.getRepository(Profile)

  await profileRepository
    .createQueryBuilder()
    .delete()
    .from(Profile)
    .where('uuid = :uuid', { uuid: userId })
    .execute()
}

export const getAllApplications = async (
  userId: string,
  type: 'mentor' | 'mentee'
): Promise<{
  statusCode: number
  applications?: Mentor[] | Mentee[] | null | undefined
  message: string
}> => {
  try {
    let applications = []
    if (type === 'mentor') {
      const mentorRepository = dataSource.getRepository(Mentor)

      const mentorApplications = await mentorRepository.find({
        where: { profile: { uuid: userId } },
        relations: ['category', 'profile']
      })

      applications = mentorApplications
    } else {
      const menteeRepository = dataSource.getRepository(Mentee)

      const menteeApplications = await menteeRepository.find({
        where: { profile: { uuid: userId } },
        relations: ['profile', 'mentor', 'mentor.profile']
      })

      applications = menteeApplications.map((application) => {
        const mentee = {
          ...application,
          mentor: getMentorPublicData(application.mentor)
        }

        return mentee as Mentee
      })
    }

    if (applications?.length === 0) {
      return {
        statusCode: 200,
        applications,
        message: `No ${type} applications found for the user`
      }
    }

    return {
      statusCode: 200,
      applications,
      message: `${type} applications found`
    }
  } catch (error) {
    console.error('Error executing query', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}
