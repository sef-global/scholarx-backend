import type { Request, Response } from 'express'
import { type ApiResponse } from '../types'
import {
  fetchMonthlyCheckIns,
  addMonthlyCheckIn
} from '../services/mentee.service'
import type MonthlyCheckIn from '../entities/checkin.entity'
import { addMentorFeedbackMonthlyCheckIn } from '../services/monthlyChecking.service'

export const postMonthlyCheckIn = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse<MonthlyCheckIn>>> => {
  try {
    const {
      menteeId,
      title,
      generalUpdatesAndFeedback,
      progressTowardsGoals,
      mediaContentLinks
    } = req.body

    const newCheckIn = await addMonthlyCheckIn(
      menteeId,
      title,
      generalUpdatesAndFeedback,
      progressTowardsGoals,
      mediaContentLinks
    )

    return res
      .status(201)
      .json({ checkIn: newCheckIn, message: 'Check-in added successfully' })
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

export const getMonthlyCheckIns = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse<MonthlyCheckIn>>> => {
  try {
    const { menteeId } = req.params

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

export const addFeedbackMonthlyCheckIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { checkInId, menteeId, mentorFeedback, isCheckedByMentor } = req.body

    const newMentorFeedbackCheckIn = await addMentorFeedbackMonthlyCheckIn(
      menteeId,
      checkInId,
      mentorFeedback,
      isCheckedByMentor
    )

    res.status(201).json({
      feedbackCheckIn: newMentorFeedbackCheckIn
    })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
    throw err
  }
}
