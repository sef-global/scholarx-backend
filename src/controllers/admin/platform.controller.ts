import type { Request, Response } from 'express'
import type { ApiResponse } from '../../types'
import type Platform from '../../entities/platform.entity'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import {
  createPlatform,
  getPlatformDetails,
  updatePlatformDetails
} from '../../services/admin/platform.service'

export const addPlatform = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Platform>> => {
  try {
    const user = req.user as Profile

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { platform, statusCode, message } = await createPlatform(req.body)
    return res.status(statusCode).json({ platform, message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}

export const getPlatform = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Platform>> => {
  try {
    const user = req.user as Profile

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { platform, statusCode, message } = await getPlatformDetails()
    return res.status(statusCode).json({ platform, message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}

export const updatePlatform = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Platform>> => {
  try {
    const user = req.user as Profile

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { platform, statusCode, message } = await updatePlatformDetails(
      req.body
    )

    return res.status(statusCode).json({ platform, message })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
