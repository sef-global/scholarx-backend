import { type Request, type Response } from 'express'
import {
  updateProfile,
  deleteProfile,
  getAllApplications
} from '../services/profile.service'
import type Profile from '../entities/profile.entity'
import type { ApiResponse } from '../types'
import type Mentor from '../entities/mentor.entity'

export const getProfileHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const { user } = req
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    return res.status(200).json(user)
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

export const updateProfileHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const user = req.user as Profile
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    const { statusCode, message, profile } = await updateProfile(user, req.body)

    return res.status(statusCode).json({ message, profile })
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

export const deleteProfileHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const user = req.user as Profile
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    await deleteProfile(user.uuid)
    return res.status(200).json({ message: 'Profile deleted' })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server errorrrr', message: err.message })
    }

    throw err
  }
}

export const getApplicationsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor[]>> => {
  try {
    const user = req.user as Profile
    const applicationType = req.query.type
    if (applicationType === 'mentor' || applicationType === 'mentee') {
      const { applications, statusCode, message } = await getAllApplications(
        user.uuid,
        applicationType
      )

      return res.status(statusCode).json({
        applications,
        message
      })
    } else {
      return res.status(400).json({ message: 'Invalid application type' })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error executing query', error)
      return res
        .status(500)
        .json({ error: 'Internal server errorrrr', message: error.message })
    }

    throw error
  }
}
