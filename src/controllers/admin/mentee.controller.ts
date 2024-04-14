import type { Request, Response } from 'express'
import { ApplicationStatus, ProfileTypes } from '../../enums'
import type Profile from '../../entities/profile.entity'
import type Mentee from '../../entities/mentee.entity'
import type { ApiResponse } from '../../types'
import { getAllMentees } from '../../services/admin/mentee.service'

export const getMentees = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee[]>> => {
  try {
    const user = req.user as Profile
    const status: ApplicationStatus | undefined = req.query.status as
      | ApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (status && !(status.toUpperCase() in ApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentees, statusCode, message } = await getAllMentees(status)
    return res.status(statusCode).json({ mentees, message })
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
