import { dataSource } from '../../configs/dbConfig'
import type Mentee from '../../entities/mentee.entity'
import { MenteeApplicationStatus } from '../../enums'
import { getAllMenteeEmailsService, getAllMentees } from './mentee.service'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Mentee Service - getAllMenteeEmailsService', () => {
  it('should get all mentee emails with a specific status successfully', async () => {
    const status: MenteeApplicationStatus = MenteeApplicationStatus.APPROVED

    const mockMentees = [
      {
        profile: {
          primary_email: 'mentee1@example.com'
        }
      },
      {
        profile: {
          primary_email: 'mentee2@example.com'
        }
      }
    ] as Mentee[]

    const mockMenteeRepository = {
      find: jest.fn().mockResolvedValue(mockMentees),
      findAndCount: jest.fn().mockResolvedValue([mockMentees, 2])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService({
      status,
      pageNumber: 1,
      pageSize: 2
    })

    expect(result.statusCode).toBe(200)
    expect(result.items?.length).toBe(2)
    expect(result.items).toEqual(['mentee1@example.com', 'mentee2@example.com'])
    expect(result.message).toBe('All mentee emails with status ' + status)
  })

  it('should get all mentee emails when status is undefined successfully', async () => {
    const mockMentees = [
      {
        profile: {
          primary_email: 'mentee1@example.com'
        }
      },
      {
        profile: {
          primary_email: 'mentee2@example.com'
        }
      }
    ] as Mentee[]

    const mockMenteeRepository = {
      find: jest.fn().mockResolvedValue(mockMentees),
      findAndCount: jest.fn().mockResolvedValue([mockMentees, 2])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService({
      status: undefined,
      pageNumber: 1,
      pageSize: 2
    })

    expect(result.statusCode).toBe(200)
    expect(result.items?.length).toBe(2)
    expect(result.items).toEqual(['mentee1@example.com', 'mentee2@example.com'])
    expect(result.message).toBe('All mentee emails with status undefined')
  })

  it('should handle mentees emails not found', async () => {
    const mockMenteeRepository = {
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService({
      status: MenteeApplicationStatus.PENDING,
      pageNumber: 1,
      pageSize: 2
    })

    expect(result.items?.length).toBe(0)
  })

  it('should handle error during mentee emails retrieval', async () => {
    const mockMenteeRepository = {
      find: jest.fn().mockRejectedValue(new Error('Test repository error'))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    await expect(
      getAllMenteeEmailsService({
        status: MenteeApplicationStatus.APPROVED,
        pageNumber: 1,
        pageSize: 2
      })
    ).rejects.toThrowError('Error getting mentee emails')
  })
})

describe('Mentee Service', () => {
  describe('getAllMentees', () => {
    it('should get all mentees successfully', async () => {
      const status: MenteeApplicationStatus = MenteeApplicationStatus.APPROVED

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
        find: jest.fn().mockResolvedValue(mockMentees),
        findAndCount: jest.fn().mockResolvedValue([mockMentees, 2])
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      const result = await getAllMentees({ status, pageNumber: 1, pageSize: 2 })

      expect(result.statusCode).toBe(200)
      expect(result.items).toEqual(mockMentees)
      expect(result.message).toBe('All mentees found')
    })

    it('should handle no mentees found', async () => {
      const status: MenteeApplicationStatus = MenteeApplicationStatus.APPROVED

      const mockMenteeRepository = {
        find: jest.fn().mockResolvedValue(null),
        findAndCount: jest.fn().mockResolvedValue([[], 0])
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      const result = await getAllMentees({ status, pageNumber: 1, pageSize: 2 })

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Mentees not found')
    })

    it('should handle error during mentees retrieval', async () => {
      const status: MenteeApplicationStatus = MenteeApplicationStatus.APPROVED

      const mockMenteeRepository = {
        find: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockMenteeRepository
      )

      await expect(
        getAllMentees({ status, pageNumber: 1, pageSize: 2 })
      ).rejects.toThrowError('Error getting mentees')
    })
  })
})
