import type { Request, Response } from 'express'
import type { ApiResponse } from '../../types'
import { getAllMenteeEmailsService } from '../../services/admin/email.service'
import { ApplicationStatus } from '../../enums'

export const getAllMenteeEmails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<string[]>> => {
  try {
    const status = req.query.status
    console.log("API Call: http://localhost:8080/api/admin/mentee/emails?status="+status)
    if (
      status === ApplicationStatus.APPROVED ||
      status === ApplicationStatus.REJECTED ||
      status === ApplicationStatus.PENDING
    ) {
      const { emails, statusCode, message } = await getAllMenteeEmailsService(
        status
      )
      return res.status(statusCode).json({ emails, message })
    } else {
      return res.status(400).json({ message: 'Invalid Status' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err || 'Internal Server Error' })
  }
}
