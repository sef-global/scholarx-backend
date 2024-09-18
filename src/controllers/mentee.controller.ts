import type { Request, Response } from 'express'
import { type ApiResponse } from '../types'
import type Mentee from '../entities/mentee.entity'
import type Profile from '../entities/profile.entity'
import {
  getMentee,
  revoke,
  updateStatus
} from '../services/admin/mentee.service'
import { MentorApplicationStatus, StatusUpdatedBy } from '../enums'
import {
  addMentee,
  addMonthlyCheckIn,
  fetchMonthlyCheckIns,
  getPublicMentee
} from '../services/mentee.service'
import type MonthlyCheckIn from '../entities/checkin.entity'

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

    if (
      !user.mentor?.filter(
        (mentor) => mentor.state === MentorApplicationStatus.APPROVED
      )
    ) {
      return res.status(403).json({ message: 'Only mentors are allowed' })
    }

    const { statusCode, message } = await updateStatus(
      menteeId,
      state,
      StatusUpdatedBy.MENTOR
    )
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

export const revokeApplication = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const user = req.user as Profile

    const { statusCode, message } = await revoke(user.uuid)
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

export const getMenteeDetails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const { menteeId } = req.params
    const { statusCode, message, mentee } = await getMentee(menteeId)
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

export const getPublicMenteeDetails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const { menteeId } = req.params
    const { statusCode, message, mentee } = await getPublicMentee(menteeId)
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

export const submitMonthlyCheckIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const { menteeId } = req.params
    const checkInData = req.body

    if (user.uuid !== menteeId) {
      res.status(403).json({ message: 'Unauthorized' })
    }

    const { statusCode, message } = await addMonthlyCheckIn(
      menteeId,
      checkInData
    )
    res.status(statusCode).json({ message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
      return
    }
    throw err
  }
}

export const getMonthlyCheckIns = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse<MonthlyCheckIn>>> => {
  try {
    const user = req.user as Profile
    const { menteeId } = req.params

    const isMentee = user.uuid === menteeId
    const isMentor = user.mentor?.some(
      (mentor) =>
        mentor.state === MentorApplicationStatus.APPROVED &&
        mentor.mentees?.some((mentee) => mentee.uuid === menteeId)
    )

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { statusCode, checkIns, message } = await fetchMonthlyCheckIns(
      menteeId
    )

    return res.status(statusCode).json({ checkIns, message })
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
