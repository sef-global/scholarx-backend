import type { Request, Response } from 'express'
import type Category from '../entities/category.entity'
import { getAllCategories } from '../services/category.service'
import { type PaginatedApiResponse } from '../types'

export const getCategories = async (
  req: Request,
  res: Response
): Promise<Response<PaginatedApiResponse<Category>>> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const { statusCode, items, totalItemCount, message } =
      await getAllCategories(pageNumber, pageSize)

    return res.status(statusCode).json({
      pageNumber,
      pageSize,
      totalItemCount,
      items,
      message
    })
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
