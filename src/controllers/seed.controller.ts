import type { Request, Response } from 'express'
import { seedDatabaseService } from '../services/seed.service'

export const seedDbController = async (
  req: Request,
  res: Response
): Promise<{ statusCode: number; message?: string }> => {
  try {
    const { statusCode, message } = await seedDatabaseService()

    return res.status(statusCode).json({ message })
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
