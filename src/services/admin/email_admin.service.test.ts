import { getAllMenteeEmailsService } from './email.service'
import { dataSource } from '../../configs/dbConfig'
import type Mentee from '../../entities/mentee.entity'
import { ApplicationStatus } from '../../enums'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Mentee Service - getAllMenteeEmailsService', () => {
  it('should get all mentee emails with a specific status successfully', async () => {
    const status: ApplicationStatus = ApplicationStatus.APPROVED

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
      find: jest.fn().mockResolvedValue(mockMentees)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService(status)

    expect(result.statusCode).toBe(200)
    expect(result.emails?.length).toBe(2)
    expect(result.emails).toEqual([
      'mentee1@example.com',
      'mentee2@example.com'
    ])
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
      find: jest.fn().mockResolvedValue(mockMentees)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService(undefined)

    expect(result.statusCode).toBe(200)
    expect(result.emails?.length).toBe(2)
    expect(result.emails).toEqual([
      'mentee1@example.com',
      'mentee2@example.com'
    ])
    expect(result.message).toBe('All mentee emails with status undefined')
  })

  it('should handle mentees emails not found', async () => {
    const mockMenteeRepository = {
      find: jest.fn().mockResolvedValue([])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    const result = await getAllMenteeEmailsService(ApplicationStatus.PENDING)

    expect(result.emails?.length).toBe(0)
  })

  it('should handle error during mentee emails retrieval', async () => {
    const mockMenteeRepository = {
      find: jest.fn().mockRejectedValue(new Error('Test repository error'))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMenteeRepository
    )

    await expect(
      getAllMenteeEmailsService(ApplicationStatus.APPROVED)
    ).rejects.toThrowError('Error getting mentee emails')
  })
})
