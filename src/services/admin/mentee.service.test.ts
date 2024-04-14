import { getAllMentees } from './mentee.service'
import { dataSource } from '../../configs/dbConfig'
import { ApplicationStatus } from '../../enums'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Mentee Service', () => {
  describe('getAllMentees', () => {
    it('should get all mentees successfully', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMentees = [
        {
          uuid: 'mock-uuid-1',
          state: status,
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn()
        },
        {
          uuid: 'mock-uuid-2',
          state: status,
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn()
        }
      ] as const

      const mockMenteeRepository = {
        find: jest.fn().mockResolvedValue(mockMentees)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      const result = await getAllMentees(status)

      expect(result.statusCode).toBe(200)
      expect(result.mentees).toEqual(mockMentees)
      expect(result.message).toBe('All mentees found')
    })

    it('should handle no mentees found', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMenteeRepository = {
        find: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      const result = await getAllMentees(status)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Mentees not found')
    })

    it('should handle error during mentees retrieval', async () => {
      const status: ApplicationStatus = ApplicationStatus.APPROVED

      const mockMenteeRepository = {
        find: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      await expect(getAllMentees(status)).rejects.toThrowError(
        'Error getting mentees'
      )
    })
  })
})
