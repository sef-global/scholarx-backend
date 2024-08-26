import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'
import { type PaginatedApiResponse } from '../types'

export const getAllCategories = async (
  pageNumber: number,
  pageSize: number
): Promise<PaginatedApiResponse<Pick<Category, 'uuid' | 'category'>>> => {
  try {
    const categoryRepository = dataSource.getRepository(Category)

    const [allCategories, totalItemCount] =
      await categoryRepository.findAndCount({
        select: ['category', 'uuid'],
        skip: (pageNumber - 1) * pageSize,
        take: pageSize
      })

    const items = allCategories.map((category) => ({
      category: category.category,
      uuid: category.uuid
    }))

    if (items.length === 0) {
      return {
        pageNumber,
        pageSize,
        totalItemCount,
        items: [],
        statusCode: 404,
        message: 'No categories found'
      }
    }

    return {
      pageNumber,
      pageSize,
      totalItemCount,
      items,
      statusCode: 200,
      message: 'Categories retrieved successfully'
    }
  } catch (err) {
    console.error('Error getting categories', err)
    throw new Error('Error getting categories')
  }
}
