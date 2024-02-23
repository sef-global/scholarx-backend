import type { Request, Response } from 'express'
import type { ApiResponse } from '../../types'
import type Mentee from '../../entities/mentee.entity'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { updateStatus } from '../../services/admin/mentee.service'

export const updateMenteeStatus = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const user = req.user as Profile
    const { state } = req.body
    const { menteeId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, message } = await updateStatus(menteeId, state)
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
