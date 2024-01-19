import {
  updateMentorStatus,
  getAllMentors,
  findAllMentorEmails
} from './mentor.service'
import { dataSource } from '../../configs/dbConfig'
import type Mentor from '../../entities/mentor.entity'
import { ApplicationStatus } from '../../enums'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Mentor Service', () => {
  describe('updateMentorStatus', () => {
    it('should handle mentor not found during update', async () => {
      const mentorId = 'nonexistent-uuid'
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        findOne: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await updateMentorStatus(mentorId, status)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Mentor not found')
    })

    it('should handle error during mentor status update', async () => {
      const mentorId = 'mock-uuid'
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        findOne: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      await expect(updateMentorStatus(mentorId, status)).rejects.toThrowError(
        'Error updating the mentor status'
      )
    })
  })

  describe('getAllMentors', () => {
    it('should get all mentors successfully', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentors = [
        {
          uuid: 'mock-uuid-1',
          state: status,
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        },
        {
          uuid: 'mock-uuid-2',
          state: status,
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        }
      ] as const

      const mockMentorRepository = {
        find: jest.fn().mockResolvedValue(mockMentors)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await getAllMentors(status)

      expect(result.statusCode).toBe(200)
      expect(result.mentors).toEqual(mockMentors)
      expect(result.message).toBe('All Mentors found')
    })

    it('should handle no mentors found', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        find: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await getAllMentors(status)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Mentors not found')
    })

    it('should handle error during mentors retrieval', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        find: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      await expect(getAllMentors(status)).rejects.toThrowError(
        'Error getting mentors'
      )
    })
  })

  describe('findAllMentorEmails', () => {
    it('should get all mentor emails successfully', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentors = [
        {
          uuid: 'mock-uuid-1',
          state: status,
          profile: {
            primary_email: 'mentor1@example.com'
          }
        },
        {
          uuid: 'mock-uuid-2',
          state: status,
          profile: {
            primary_email: 'mentor2@example.com'
          }
        }
      ] as Mentor[]

      const mockMentorRepository = {
        find: jest.fn().mockResolvedValue(mockMentors)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      const result = await findAllMentorEmails(status)

      expect(result.statusCode).toBe(200)
      expect(result.emails).toEqual([
        'mentor1@example.com',
        'mentor2@example.com'
      ])
      expect(result.message).toBe('All Mentors Emails found')
    })

    it('should handle no mentor emails found', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        find: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      try {
        await findAllMentorEmails(status)
        fail('Expected an error, but none was thrown')
      } catch (error: any) {
        expect(error.message).toBe('Error getting mentors emails')
      }
    })

    it('should handle error during mentor emails retrieval', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentorRepository = {
        find: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMentorRepository
      )

      await expect(findAllMentorEmails(status)).rejects.toThrowError(
        'Error getting mentors emails'
      )
    })
  })
})
