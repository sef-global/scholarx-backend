import type { Request, Response } from 'express'
import { getAllCategories } from '../services/category.service'
import type { ApiResponse } from '../types'
import type Category from '../entities/category.entity'

export const getCategories = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Category>> => {
  try {
    const { statusCode, categories, message } = await getAllCategories()

    return res.status(statusCode).json({ categories, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}
