import type { Request, Response } from 'express'
import { createMentor } from '../services/mentor.service'

export const postMentorHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await createMentor(req)
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}
