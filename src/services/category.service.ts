import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'

interface CategoryType {
  category: string
  id: string
}

export const getAllCategories = async (): Promise<{
  statusCode: number
  categories?: CategoryType[] | null
  message: string
}> => {
  try {
    const categoryRepository = dataSource.getRepository(Category)
    const allCategories: Category[] = await categoryRepository.find({
      select: ['category', 'uuid']
    })

    const categories = allCategories.map((category) => {
      return { category: category.category, id: category.uuid }
    })

    if (!categories) {
      return {
        statusCode: 404,
        message: 'Categories not found'
      }
    }

    return {
      statusCode: 200,
      categories,
      message: 'All Categories found'
    }
  } catch (err) {
    console.error('Error getting mentor', err)
    throw new Error('Error getting mentor')
  }
}
