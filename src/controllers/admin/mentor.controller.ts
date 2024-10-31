import type { Request, Response } from 'express'
import type Mentor from '../../entities/mentor.entity'
import type Profile from '../../entities/profile.entity'
import { MentorApplicationStatus, ProfileTypes } from '../../enums'
import {
  findAllMentorEmails,
  getAllMentors,
  getMentor,
  updateMentorDetails,
  updateMentorStatus
} from '../../services/admin/mentor.service'
import {
  searchMentorsByQuery,
  updateAvailability
} from '../../services/mentor.service'
import type { ApiResponse, PaginatedApiResponse } from '../../types'
import { IMG_HOST } from '../../configs/envConfig'
import { formatValidationErrors, upload } from '../../utils'
import { mentorUpdateSchema } from '../../schemas/admin/admin.mentor-routes.schema'

export const updateMentorHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  const user = req.user as Profile

  if (user.type !== ProfileTypes.ADMIN) {
    return res.status(403).json({ message: 'Only Admins are allowed' })
  }

  try {
    await new Promise<void>((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const data = req.body.data ? JSON.parse(req.body.data) : req.body

    const result = mentorUpdateSchema.safeParse(data)
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid data',
        details: formatValidationErrors(result.error)
      })
    }

    const mentorUpdateData: Partial<Mentor> = { ...data }
    const profileUpdateData: Partial<Profile> = { ...data.profile }

    if (req.file) {
      profileUpdateData.image_url = `${IMG_HOST}/${req.file.filename}`
    }

    const { mentorId } = req.params

    const { mentor, statusCode, message } = await updateMentorDetails(
      mentorId,
      mentorUpdateData,
      profileUpdateData
    )
    return res.status(statusCode).json({ mentor, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error updating mentor details:', err)
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      })
    }
    throw err
  }
}

export const mentorStatusHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { state } = req.body
    const { mentorId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (!(state.toUpperCase() in MentorApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentor, statusCode, message } = await updateMentorStatus(
      mentorId,
      state
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
): Promise<ApiResponse<PaginatedApiResponse<Mentor>>> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)

    const user = req.user as Profile
    const status: MentorApplicationStatus | undefined = req.query.status as
      | MentorApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (status && !(status.toUpperCase() in MentorApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { items, totalItemCount, statusCode, message } = await getAllMentors({
      status,
      pageNumber,
      pageSize
    })
    return res.status(statusCode).json({
      pageNumber,
      pageSize,
      totalItemCount,
      items,
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

export const getAllMentorEmails = async (
  req: Request,
  res: Response
): Promise<ApiResponse<string[]>> => {
  try {
    const user = req.user as Profile
    const status: MentorApplicationStatus | undefined = req.query.status as
      | MentorApplicationStatus
      | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    if (status && !(status.toUpperCase() in MentorApplicationStatus)) {
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

    const { statusCode, message } = await updateAvailability(
      mentorId,
      availability
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

export const searchMentors = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const q: string | undefined = req.query.q as string | undefined

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { statusCode, mentors, message } = await searchMentorsByQuery(q)
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

export const mentorDetailsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { mentorId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { mentor, statusCode, message } = await getMentor(mentorId)

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
