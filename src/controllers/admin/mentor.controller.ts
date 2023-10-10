import type { Request, Response } from 'express'
import {
  findAllMentorEmails,
  getAllMentors,
  updateMentorStatus
} from '../../services/admin/mentor.service'
import { ApplicationStatus, ProfileTypes } from '../../enums'
import type Profile from '../../entities/profile.entity'
import type Mentor from '../../entities/mentor.entity'
import type { ApiResponse } from '../../types'

export const mentorStatusHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { status } = req.body
    const { mentorId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (!(status.toUpperCase() in ApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentor, statusCode, message } = await updateMentorStatus(
      mentorId,
      status
    )
    return res.status(statusCode).json({ mentor, message })
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

export const getAllMentorsByStatus = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const status: ApplicationStatus | undefined = req.query.status as
      | ApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (status && !(status?.toUpperCase() in ApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentors, statusCode, message } = await getAllMentors(status)
    return res.status(statusCode).json({ mentors, message })
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

export const getAllMentorEmails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const status: ApplicationStatus | undefined = req.query.status as
      | ApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      if (status && !(status?.toUpperCase() in ApplicationStatus)) {
        res.status(400).json({ message: 'Please provide a valid status' })
        return
      }
      const { emails, statusCode, message } = await findAllMentorEmails(status)
      res.status(statusCode).json({ emails, message })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}
