import {
  updateProfile,
  deleteProfile,
  getAllMentorApplications
} from './profile.service'
import { dataSource } from '../configs/dbConfig'
import Profile from '../entities/profile.entity'

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Profile Service', () => {
  describe('updateProfile', () => {
    it('should update the profile successfully', async () => {
      const user = { uuid: 'mock-uuid' } as unknown as Profile
      const partialProfile = {
        primary_email: 'new@example.com',
        first_name: 'John'
      }

      const mockProfileRepository = {
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        findOneBy: jest.fn().mockResolvedValue({
          uuid: 'mock-uuid',
          ...partialProfile
        } as const)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockProfileRepository
      )

      const result = await updateProfile(user, partialProfile)

      expect(result.statusCode).toBe(200)
      expect(result.profile?.uuid).toBe('mock-uuid')
      expect(result.profile?.primary_email).toBe('new@example.com')
      expect(result.profile?.first_name).toBe('John')
      expect(result.message).toBe('Successfully updated the profile')

      expect(mockProfileRepository.update).toHaveBeenCalledWith(
        { uuid: user.uuid },
        partialProfile
      )

      expect(mockProfileRepository.findOneBy).toHaveBeenCalledWith({
        uuid: user.uuid
      })
    })

    it('should handle error during profile update', async () => {
      const user = { uuid: 'mock-uuid' } as unknown as Profile
      const partialProfile = {
        primary_email: 'new@example.com',
        first_name: 'John'
      }

      const mockProfileRepository = {
        update: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockProfileRepository
      )

      const result = await updateProfile(user, partialProfile)

      expect(result.statusCode).toBe(500)
      expect(result.message).toBe('Internal server error')
    })
  })

  describe('deleteProfile', () => {
    it('should delete the profile successfully', async () => {
      const userId = 'mock-uuid'

      const mockProfileRepository = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 })
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockProfileRepository
      )

      await deleteProfile(userId)

      expect(mockProfileRepository.createQueryBuilder).toHaveBeenCalled()
      expect(mockProfileRepository.delete).toHaveBeenCalled()
      expect(mockProfileRepository.from).toHaveBeenCalledWith(Profile)
      expect(mockProfileRepository.where).toHaveBeenCalledWith('uuid = :uuid', {
        uuid: userId
      })
      expect(mockProfileRepository.execute).toHaveBeenCalled()
    })

    it('should handle error during profile deletion', async () => {
      const userId = 'mock-uuid'

      const mockProfileRepository = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error('Error executing delete query'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockProfileRepository
      )

      await expect(deleteProfile(userId)).rejects.toThrowError(
        'Error executing delete query'
      )
    })
  })

  describe('getAllMentorApplications', () => {
    it('should get all mentor applications for the user', async () => {
      const user = { uuid: 'mock-uuid' } as unknown as Profile

      const mockMentorRepository = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            uuid: 'mentor-uuid-1',
            application: 'Application 1',
            profile: user,
            category: {}
          },
          {
            uuid: 'mentor-uuid-2',
            application: 'Application 2',
            profile: user,
            category: {}
          }
        ] as const)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await getAllMentorApplications(user)

      expect(result.statusCode).toBe(200)
      expect(result.mentorApplications?.length).toBe(2)
      expect(result.mentorApplications?.[0].uuid).toBe('mentor-uuid-1')
      expect(result.mentorApplications?.[1].uuid).toBe('mentor-uuid-2')
      expect(result.message).toBe('Mentor applications found')

      expect(mockMentorRepository.createQueryBuilder).toHaveBeenCalled()
      expect(mockMentorRepository.innerJoinAndSelect).toHaveBeenCalledWith(
        'mentor.profile',
        'profile'
      )
      expect(mockMentorRepository.addSelect).toHaveBeenCalledWith(
        'mentor.application'
      )
      expect(mockMentorRepository.where).toHaveBeenCalledWith(
        'mentor.profile.uuid = :uuid',
        {
          uuid: user.uuid
        }
      )
      expect(mockMentorRepository.getMany).toHaveBeenCalled()
    })

    it('should handle error during mentor applications retrieval', async () => {
      const user = { uuid: 'mock-uuid' } as unknown as Profile

      const mockMentorRepository = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockRejectedValue(new Error('Error executing delete query'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await getAllMentorApplications(user)

      expect(result.statusCode).toBe(500)
      expect(result.message).toBe('Internal server error')
    })
  })
})
