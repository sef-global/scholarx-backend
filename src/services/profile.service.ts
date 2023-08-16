import { dataSource } from '../configs/dbConfig'
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
