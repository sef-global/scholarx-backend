import type { Request, Response } from 'express'
import { getAllCategories } from '../services/category.service'

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { statusCode, categories, message } = await getAllCategories()

    res.status(statusCode).json({ categories, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}
