import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity'
import Profile from '../entities/profile.entity'

export const updateProfile = async (
  user: Profile,
  { primary_email, first_name, last_name, image_url }: Partial<Profile>
): Promise<{
  statusCode: number
  profile?: Profile | null
  message: string
}> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)

    await profileRepository.update(
      { uuid: user.uuid },
      {
        primary_email,
        first_name,
        last_name,
        image_url
      }
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

export const getAllMentorApplications = async (
  user: Profile
): Promise<{
  statusCode: number
  mentorApplications?: Mentor[] | null | undefined
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const existingMentorApplications = await mentorRepository
      .createQueryBuilder('mentor')
      .innerJoinAndSelect('mentor.profile', 'profile')
      .innerJoinAndSelect('mentor.category', 'category')
      .addSelect('mentor.application')
      .where('mentor.profile.uuid = :uuid', { uuid: user.uuid })
      .getMany()

    console.log(existingMentorApplications)
    if (existingMentorApplications.length === 0) {
      return {
        statusCode: 200,
        message: 'No mentor applications found for the user'
      }
    }

    return {
      statusCode: 200,
      mentorApplications: existingMentorApplications,
      message: 'Mentor applications found'
    }
  } catch (error) {
    console.error('Error executing query', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}
