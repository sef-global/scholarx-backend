import type { Request, Response } from 'express'
import { type ApiResponse } from '../types'
import type Mentee from '../entities/mentee.entity'
import type Profile from '../entities/profile.entity'
import { addMentee, updateStatus } from '../services/admin/mentee.service'
import { ProfileTypes } from '../enums'

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

export const updateMenteeStatus = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const user = req.user as Profile
    const { state } = req.body
    const { menteeId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, message } = await updateStatus(menteeId, state)
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
