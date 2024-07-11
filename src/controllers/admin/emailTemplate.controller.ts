import type { Request, Response } from 'express'
import type EmailTemplate from '../../entities/emailTemplate.entity'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import {
  createEmailTemplate,
  deleteEmailTemplateById,
  getEmailTemplateById
} from '../../services/admin/emailTemplate.service'
import type { ApiResponse } from '../../types'

export const addEmailTemplate = async (
  req: Request,
  res: Response
): Promise<ApiResponse<EmailTemplate>> => {
  try {
    const user = req.user as Profile
    const { subject, content } = req.body

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (!subject || !content) {
      return res.status(400).json({
        error: 'Subject, content and state are required fields'
      })
    }
    const { emailTemplate, statusCode, message } = await createEmailTemplate(
      subject,
      content
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
): Promise<ApiResponse<EmailTemplate>> => {
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

export const deleteEmailTemplate = async (
  req: Request,
  res: Response
): Promise<ApiResponse<EmailTemplate>> => {
  try {
    const user = req.user as Profile
    const templateId = req.params.templateId

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, message } = await deleteEmailTemplateById(templateId)
    return res.status(statusCode).json({ message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
