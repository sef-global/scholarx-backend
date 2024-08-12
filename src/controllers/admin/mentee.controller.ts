import type { Request, Response } from 'express'
import type Mentee from '../../entities/mentee.entity'
import type Profile from '../../entities/profile.entity'
import {
  MenteeApplicationStatus,
  ProfileTypes,
  StatusUpdatedBy
} from '../../enums'
import {
  getAllMenteeEmailsService,
  getAllMentees,
  getMentee,
  updateStatus
} from '../../services/admin/mentee.service'
import type { ApiResponse, PaginatedApiResponse } from '../../types'

export const getMentees = async (
  req: Request,
  res: Response
): Promise<ApiResponse<PaginatedApiResponse<Mentee>>> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)

    const user = req.user as Profile
    const status: MenteeApplicationStatus | undefined = req.query.status as
      | MenteeApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (status && !(status.toUpperCase() in MenteeApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { items, totalItemCount, statusCode, message } = await getAllMentees({
      status,
      pageNumber,
      pageSize
    })
    return res.status(statusCode).json({
      items,
      totalItemCount,
      pageNumber,
      pageSize,
      message
    })
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

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, message } = await updateStatus(
      menteeId,
      state,
      StatusUpdatedBy.ADMIN
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

export const getMenteeDetails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee>> => {
  try {
    const user = req.user as Profile
    const { menteeId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

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

export const getAllMenteeEmails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<PaginatedApiResponse<string>>> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)

    const status: MenteeApplicationStatus | undefined = req.query.status as
      | MenteeApplicationStatus
      | undefined
    if (status && status.toUpperCase() in MenteeApplicationStatus) {
      const { items, statusCode, message, totalItemCount } =
        await getAllMenteeEmailsService({
          status,
          pageNumber,
          pageSize
        })
      return res.status(statusCode).json({
        items,
        pageNumber,
        pageSize,
        totalItemCount,
        message
      })
    } else {
      return res.status(400).json({ message: 'Invalid Status' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err || 'Internal Server Error' })
  }
}
