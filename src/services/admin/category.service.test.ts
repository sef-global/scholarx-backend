import { createCategory, changeCategory } from './category.service'
import { dataSource } from '../../configs/dbConfig'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Category Service', () => {
  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const categoryName = 'Test Category'
      const mockCategoryRepository = {
        save: jest.fn().mockResolvedValue({
          uuid: 'mock-uuid',
          category: categoryName,
          mentors: [],
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        } as const)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockCategoryRepository
      )

      const result = await createCategory(categoryName)

      expect(result.statusCode).toBe(201)
      expect(result.category?.category).toBe(categoryName)
      expect(result.message).toBe('Category created successfully')
    })

    it('should handle error during category creation', async () => {
      const categoryName = 'Test Category'
      const mockCategoryRepository = {
        save: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockCategoryRepository
      )

      await expect(createCategory(categoryName)).rejects.toThrowError(
        'Error creating category'
      )
    })
  })

  describe('changeCategory', () => {
    it('should update a category successfully', async () => {
      const categoryId = 'mock-uuid'
      const categoryName = 'Updated Category'
      const mockCategory = {
        uuid: 'mock-uuid',
        category: categoryName,
        mentors: [],
        created_at: new Date(),
        updated_at: new Date(),
        updateTimestamps: jest.fn(),
        generateUuid: jest.fn()
      } as const

      const mockCategoryRepository = {
        findOne: jest.fn().mockResolvedValue(mockCategory),
        update: jest.fn().mockResolvedValue({ affected: 1 })
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockCategoryRepository
      )

      const result = await changeCategory(categoryId, categoryName)

      expect(result.statusCode).toBe(201)
      expect(result.category?.category).toBe(categoryName)
      expect(result.message).toBe('Category updated successfully')
    })

    it('should handle category not found during update', async () => {
      const categoryId = 'nonexistent-uuid'
      const categoryName = 'Updated Category'
      const mockCategoryRepository = {
        findOne: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockCategoryRepository
      )

      const result = await changeCategory(categoryId, categoryName)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Category not found')
    })

    it('should handle error during category update', async () => {
      const categoryId = 'mock-uuid'
      const categoryName = 'Updated Category'
      const mockCategoryRepository = {
        findOne: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockCategoryRepository
      )

      await expect(
        changeCategory(categoryId, categoryName)
      ).rejects.toThrowError('Error updating category')
    })
  })
})
