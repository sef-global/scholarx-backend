import type { Request, Response } from 'express'
import { getAllUsers } from '../../services/admin.service'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    if (user.type !== ProfileTypes.ADMIN) {
      res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      const users = await getAllUsers()
      if (users?.length === 0) {
        res.status(404).json({ message: 'No users available' })
      } else {
        res.status(200).json({ profiles: users })
      }
    }
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}
