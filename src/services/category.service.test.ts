import { getAllCategories } from './category.service'
import { dataSource } from '../configs/dbConfig'
import type Category from '../entities/category.entity'

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Category Service - getAllCategories', () => {
  it('should get all categories successfully', async () => {
    const mockCategories = [
      {
        uuid: 'mock-uuid-1',
        category: 'Category 1'
      },
      {
        uuid: 'mock-uuid-2',
        category: 'Category 2'
      }
    ] as Category[]

    const mockCategoryRepository = {
      find: jest.fn().mockResolvedValue(mockCategories)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCategoryRepository
    )

    const result = await getAllCategories()

    expect(result.statusCode).toBe(200)
    expect(result.categories?.length).toBe(2)
    expect(result.categories).toEqual([
      { uuid: 'mock-uuid-1', category: 'Category 1' },
      { uuid: 'mock-uuid-2', category: 'Category 2' }
    ])
    expect(result.message).toBe('All Categories found')
  })

  it('should handle categories not found', async () => {
    const mockCategoryRepository = {
      find: jest.fn().mockResolvedValue([])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCategoryRepository
    )

    const result = await getAllCategories()

    expect(result.categories?.length).toBe(0)
  })

  it('should handle error during category retrieval', async () => {
    const mockCategoryRepository = {
      find: jest.fn().mockRejectedValue(new Error('Test repository error'))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCategoryRepository
    )

    await expect(getAllCategories()).rejects.toThrowError(
      'Error getting mentor'
    )
  })
})
