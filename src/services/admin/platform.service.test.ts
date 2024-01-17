import {
  createPlatform,
  getPlatformDetails,
  updatePlatformDetails
} from './platform.service'
import { dataSource } from '../../configs/dbConfig'
import type Platform from '../../entities/platform.entity'
import { v4 as uuidv4 } from 'uuid'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Platform Service', () => {
  describe('createPlatform', () => {
    it('should create a platform successfully', async () => {
      const mockPlatform: Platform = {
        uuid: 'mock-uuid',
        created_at: new Date(),
        updated_at: new Date(),
        updateTimestamps() {
          this.updated_at = new Date()
          if (!this.uuid) {
            this.created_at = new Date()
          }
        },
        generateUuid: async function () {
          if (!this.uuid) {
            this.uuid = uuidv4()
          }
        },
        description: 'Mock Platform Description',
        mentor_questions: {} as unknown as JSON,
        image_url: 'https://example.com/mock-image.jpg',
        landing_page_url: 'https://example.com/mock-landing-page',
        title: 'Mock Platform Title'
      }

      const mockPlatformRepository = {
        save: jest.fn().mockResolvedValue(mockPlatform)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      const result = await createPlatform(mockPlatform)

      expect(result.statusCode).toBe(201)
      expect(result.platform).toEqual(mockPlatform)
      expect(result.message).toBe('Platform created successfully ')
    })

    it('should handle error during platform creation', async () => {
      const mockPlatformRepository = {
        save: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      await expect(createPlatform({} as Platform)).rejects.toThrowError(
        'Error creating Platform'
      )
    })
  })

  describe('getPlatformDetails', () => {
    it('should get platform details successfully', async () => {
      const mockPlatform: Platform = {
        uuid: 'mock-uuid',
        created_at: new Date(),
        updated_at: new Date(),
        updateTimestamps() {
          this.updated_at = new Date()
          if (!this.uuid) {
            this.created_at = new Date()
          }
        },
        generateUuid: async function () {
          if (!this.uuid) {
            this.uuid = uuidv4()
          }
        },
        description: 'Mock Platform Description',
        mentor_questions: {} as unknown as JSON,
        image_url: 'https://example.com/mock-image.jpg',
        landing_page_url: 'https://example.com/mock-landing-page',
        title: 'Mock Platform Title'
      }
      const mockPlatforms: Platform[] = [mockPlatform]

      const mockPlatformRepository = {
        find: jest.fn().mockResolvedValue(mockPlatforms)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      const result = await getPlatformDetails()

      expect(result.statusCode).toBe(200)
      expect(result.platform).toEqual(mockPlatforms)
      expect(result.message).toBe('Get Platform details successfully')
    })

    it('should handle error during platform details retrieval', async () => {
      const mockPlatformRepository = {
        find: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      await expect(getPlatformDetails()).rejects.toThrowError(
        'Error creating Platform'
      )
    })
  })

  describe('updatePlatformDetails', () => {
    it('should update platform details successfully', async () => {
      const mockPlatform: Platform = {
        uuid: 'mock-uuid',
        created_at: new Date(),
        updated_at: new Date(),
        updateTimestamps() {
          this.updated_at = new Date()
          if (!this.uuid) {
            this.created_at = new Date()
          }
        },
        generateUuid: async function () {
          if (!this.uuid) {
            this.uuid = uuidv4()
          }
        },
        description: 'Mock Platform Description',
        mentor_questions: {} as unknown as JSON,
        image_url: 'https://example.com/mock-image.jpg',
        landing_page_url: 'https://example.com/mock-landing-page',
        title: 'Mock Platform Title'
      }

      const mockPlatformRepository = {
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        findOne: jest.fn().mockResolvedValue(mockPlatform)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      const result = await updatePlatformDetails({
        uuid: 'mock-uuid'
      } as Platform)

      expect(result.statusCode).toBe(200)
      expect(result.platform).toEqual(mockPlatform)
      expect(result.message).toBe('Platform updated successfully')
    })

    it('should handle platform not found during update', async () => {
      const mockPlatformRepository = {
        update: jest.fn().mockResolvedValue({ affected: 0 })
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      const result = await updatePlatformDetails({
        uuid: 'nonexistent-uuid'
      } as Platform)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Platform not found')
    })

    it('should handle error during platform update', async () => {
      const mockPlatformRepository = {
        update: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockPlatformRepository
      )

      await expect(updatePlatformDetails({} as Platform)).rejects.toThrowError(
        'Error updating platform'
      )
    })
  })
})
