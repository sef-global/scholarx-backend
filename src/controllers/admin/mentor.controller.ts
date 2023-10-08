import type { Request, Response } from 'express'
import { updateMentorStatus } from '../../services/admin/mentor.service'
import { ApplicationStatus, ProfileTypes } from '../../enums'
import type Profile from '../../entities/profile.entity'
import Mentor from '../../entities/mentor.entity'

interface MentorStatusResponse {
  statusCode: number
  message?: string
  mentor?: Mentor | null
}

export const mentorStatusHandler = async (
  req: Request,
  res: Response
): Promise<MentorStatusResponse> => {
  try {
    const user = req.user as Profile
    const { status } = req.body
    const { mentorId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      if (!(status.toUpperCase() in ApplicationStatus)) {
        return res
          .status(400)
          .json({ message: 'Please provide a valid status' })
      }
      const { mentor, statusCode, message } = await updateMentorStatus(
        mentorId,
        status
      )
      return res.status(statusCode).json({ mentor, message })
    }
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
