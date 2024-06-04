import { dataSource } from '../../configs/dbConfig'
import Category from '../../entities/category.entity'

export const createCategory = async (
  categoryName: string
): Promise<{
  statusCode: number
  category?: Category | null
  message: string
}> => {
  try {
    const categoryRepository = dataSource.getRepository(Category)

    const newCategory = new Category(categoryName)

    const saveCategory = await categoryRepository.save(newCategory)

    return {
      statusCode: 201,
      category: saveCategory,
      message: 'Category created successfully'
    }
  } catch (err) {
    console.error('Error creating category', err)
    throw new Error('Error creating category')
  }
}

export const changeCategory = async (
  categoryId: string,
  categoryName: string
): Promise<{
  statusCode: number
  category?: Category | null
  message: string
}> => {
  try {
    const categoryRepository = dataSource.getRepository(Category)

    const category = await categoryRepository.findOne({
      where: { uuid: categoryId }
    })

    if (!category) {
      return {
        statusCode: 404,
        message: 'Category not found'
      }
    }

    await categoryRepository.update(
      { uuid: categoryId },
      { category: categoryName }
    )

    return {
      statusCode: 201,
      category,
      message: 'Category updated successfully'
    }
  } catch (err) {
    console.error('Error updating category', err)
    throw new Error('Error updating category')
  }
}
