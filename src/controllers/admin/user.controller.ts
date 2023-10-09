import type { Request, Response } from 'express'
import { getAllUsers } from '../../services/admin/user.service'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { ApiResponse } from '../../types'

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const user = req.user as Profile

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      const users = await getAllUsers()
      if (users?.length === 0) {
        return res.status(404).json({ message: 'No users available' })
      } else {
        return res.status(200).json({ profiles: users })
      }
    }
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
