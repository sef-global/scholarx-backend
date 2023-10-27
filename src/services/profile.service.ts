import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity'
import Profile from '../entities/profile.entity'

export const updateProfile = async (
  user: Profile,
  {
    primary_email,
    contact_email,
    first_name,
    last_name,
    image_url,
    linkedin_url
  }: Partial<Profile>
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
        contact_email,
        first_name,
        last_name,
        image_url,
        linkedin_url
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
      .select([
        'mentor.state AS state',
        'mentor.availability AS availability',
        'mentor.uuid AS uuid',
        'mentor.created_at AS created_at',
        'mentor.updated_at AS updated_at',
        'mentor.application AS application',
        'category.category AS category',
        'category.uuid AS category_uuid'
      ])
      .leftJoin('mentor.category', 'category')
      .where('mentor.profile.uuid = :uuid', { uuid: user.uuid })
      .getRawMany()

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
