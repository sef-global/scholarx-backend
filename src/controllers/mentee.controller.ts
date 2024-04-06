import type { Request, Response } from 'express'
import { type ApiResponse } from '../types'
import type Mentee from '../entities/mentee.entity'
import type Profile from '../entities/profile.entity'
import { addMentee } from '../services/admin/mentee.service'

export const menteeApplicationHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const user = req.user as Profile
    const { application, mentorId } = req.body
    const { mentee, statusCode, message } = await addMentee(
      user,
      application,
      mentorId
    )
    return res.status(statusCode).json({ mentee, message })
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
