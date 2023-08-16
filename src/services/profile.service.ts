import type { Request } from 'express'
import { dataSource } from '../configs/dbConfig'
import Profile from '../entities/profile.entity'

export const getProfile = async (
  req: Request
): Promise<Profile | undefined> => {
  return req.user as Profile
}

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
): Promise<Profile | null> => {
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

  return savedProfile
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
