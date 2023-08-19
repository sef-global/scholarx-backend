import type { Request, Response } from 'express'
import { updateProfile, deleteProfile } from '../services/profile.service'
import type Profile from '../entities/profile.entity'
export const getProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}

export const updateProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    }

    const { statusCode, message, profile } =
      user && (await updateProfile(user, req.body))

    res.status(statusCode).json({ message, profile })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}

export const deleteProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    } else {
      await deleteProfile(user.uuid)
      res.status(200).json({ message: 'Profile deleted' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}
