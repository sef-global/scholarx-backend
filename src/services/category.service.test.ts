import { dataSource } from '../configs/dbConfig'
import type Category from '../entities/category.entity'
import { getAllCategories } from './category.service'

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

    const result = await getAllCategories(1, 2)

    expect(result.statusCode).toBe(200)
    expect(result.items?.length).toBe(2)
    expect(result.items).toEqual([
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

    const result = await getAllCategories(1, 2)

    expect(result.items?.length).toBe(0)
  })
})
