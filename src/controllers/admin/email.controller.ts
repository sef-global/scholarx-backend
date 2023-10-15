import type { Request, Response } from 'express'
import type { ApiResponse } from '../../types'
import type Email from '../../entities/email.entity'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import {
  createEmailTemplate,
  getEmailTemplateById
} from '../../services/admin/email.service'

export const addEmailTemplate = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Email>> => {
  try {
    const user = req.user as Profile
    const { recipient, subject, content, state } = req.body

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (!recipient || !subject || !content || !state) {
      return res.status(400).json({
        error: 'Receipent, subject, content and state are required fields'
      })
    }
    const { emailTemplate, statusCode, message } = await createEmailTemplate(
      recipient,
      subject,
      content,
      state
    )
    return res.status(statusCode).json({ emailTemplate, message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}

export const getEmailTemplate = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Email>> => {
  try {
    const user = req.user as Profile
    const templateId = req.params.mentorId

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { emailTemplate, statusCode, message } = await getEmailTemplateById(
      templateId
    )
    return res.status(statusCode).json({ emailTemplate, message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
