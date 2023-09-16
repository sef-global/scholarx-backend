import { dataSource } from '../../configs/dbConfig'
import Profile from '../../entities/profile.entity'

export const getAllUsers = async (): Promise<Profile[] | undefined> => {
  const profileRepository = dataSource.getRepository(Profile)
  const allUsers = await profileRepository.find()
  return allUsers
}
