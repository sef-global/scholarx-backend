import { dataSource } from '../../configs/dbConfig'
import Profile from '../../entities/profile.entity'
import { type PaginatedApiResponse } from '../../types'

export const getAllUsers = async ({
  pageNumber,
  pageSize
}: {
  pageNumber: number
  pageSize: number
}): Promise<PaginatedApiResponse<Profile>> => {
  const profileRepository = dataSource.getRepository(Profile)
  const [users, count] = await profileRepository.findAndCount({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize
  })
  return {
    pageNumber,
    pageSize,
    totalItemCount: count,
    items: users,
    statusCode: 200,
    message: 'Users retrieved successfully'
  }
}
