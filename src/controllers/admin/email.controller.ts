import { type Request, type Response } from 'express'
import type Profile from '../../entities/profile.entity'
import { type ApiResponse } from '../../types'
import type Email from '../../entities/email.entity'
import { ProfileTypes } from '../../enums'
import { sendEmail } from '../../services/admin/email.service'
import { ReminderService } from '../../services/admin/reminder.service'

export const sendEmailController = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Email>> => {
  const { to, subject, text } = req.body

  try {
    const user = req.user as Profile

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, message } = await sendEmail(to, subject, text)
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

const reminderService = new ReminderService()

export const processEmailReminderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { statusCode, message } = await reminderService.processReminders()
    res.status(statusCode).json({ message })
  } catch (err) {
    console.error('Error enabling reminder', err)
    res.status(500).json({ message: 'Error enabling reminder' })
  }
}

export const scheduleNewReminderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { statusCode, message } = await reminderService.scheduleNewReminders()
    res.status(statusCode).json({ message })
  } catch (err) {
    console.error('Error scheduling reminder', err)
    res.status(500).json({ message: 'Error scheduling reminder' })
  }
}
