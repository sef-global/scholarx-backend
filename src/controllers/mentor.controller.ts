import type { Request, Response } from 'express'
import type Mentee from '../entities/mentee.entity'
import type Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { MenteeApplicationStatus } from '../enums'
import { getAllMenteesByMentor } from '../services/admin/mentee.service'
import {
  createMentor,
  getAllMentors,
  getMentor,
  updateAvailability
} from '../services/mentor.service'
import type { ApiResponse, PaginatedApiResponse } from '../types'

export const mentorApplicationHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { application, categoryId, countryId } = req.body

    const { mentor, statusCode, message } = await createMentor(
      user,
      application,
      categoryId,
      countryId
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

export const mentorAvailabilityHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const { availability } = req.body
    const { mentorId } = req.params

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

export const mentorDetailsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const mentorId = req.params.mentorId
    const { mentor, statusCode, message } = await getMentor(mentorId)

    if (!mentor) {
      return res.status(statusCode).json({ error: message })
    }

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

export const getAllMentorsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<PaginatedApiResponse<Mentor>>> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)

    const categoryId: string = req.query.categoryId as string
    const { items, totalItemCount, statusCode, message } = await getAllMentors({
      categoryId,
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

export const getMenteesByMentor = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee[]>> => {
  try {
    const user = req.user as Profile
    const status: MenteeApplicationStatus | undefined = req.query.status as
      | MenteeApplicationStatus
      | undefined

    if (status && !(status.toUpperCase() in MenteeApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentees, statusCode, message } = await getAllMenteesByMentor(
      status,
      user.uuid
    )
    return res.status(statusCode).json({ mentees, message })
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
