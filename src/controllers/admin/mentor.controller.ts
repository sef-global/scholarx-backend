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
import { searchMentorsByQuery, updateAvailability } from '../../services/mentor.service'

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
): Promise<ApiResponse<string[]>> => {
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

    const { emails, statusCode, message } = await findAllMentorEmails(status)
    return res.status(statusCode).json({ emails, message })
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

export const updateMentorAvailability = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { availability } = req.body
    const { mentorId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, updatedMentorApplication, message } =
      await updateAvailability(mentorId, availability)
    return res.status(statusCode).json({ updatedMentorApplication, message })
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

export const searchMentors = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const q: string | undefined = req.query.q as string | undefined;

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, mentors, message } =
      await searchMentorsByQuery(q)
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
