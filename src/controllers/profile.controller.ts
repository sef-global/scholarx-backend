import type { Request, Response } from 'express'
import { getProfile, updateProfile } from '../services/profile.service'

export const getProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getProfile(req)
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}

export const updateProfileHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getProfile(req)
    if (!user) {
      res.status(404).json({ message: 'Profile not found' })
    }

    const updatedProfile = user && (await updateProfile(user, req.body))

    if (!updatedProfile) {
      res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json(updatedProfile)
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}
