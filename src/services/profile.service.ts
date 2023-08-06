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
): Promise<Profile | undefined> => {
  const profileRepository = dataSource.getRepository(Profile)

  const updatedProfile = await profileRepository
    .createQueryBuilder()
    .update(Profile)
    .set({
      primary_email,
      contact_email,
      first_name,
      last_name,
      image_url,
      linkedin_url,
      updated_at: new Date().toISOString()
    })
    .where('uuid = :uuid', { uuid: user?.uuid })
    .returning([
      'uuid',
      'primary_email',
      'contact_email',
      'first_name',
      'last_name',
      'image_url',
      'linkedin_url',
      'type',
      'created_at',
      'updated_at'
    ])
    .execute()

  return updatedProfile.raw.length === 0 ? undefined : updatedProfile.raw[0]
}
