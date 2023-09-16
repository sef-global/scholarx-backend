import type { Request, Response } from 'express'
import { createMentor } from '../services/mentor.service'
import type Profile from '../entities/profile.entity'

export const mentorApplicationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const { application, categoryId } = req.body

    const { mentor, statusCode, message } = await createMentor(
      user,
      application,
      categoryId
    )

    res.status(statusCode).json({ mentor, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}
