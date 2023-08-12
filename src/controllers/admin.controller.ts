import type { Request, Response } from 'express'
import { getAllUsers } from '../services/admin.service'

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers(req)
    if (users && users.length != 0) {
      res.status(404).json({ message: 'No users available' })
    }

    res.status(200).json(users)
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}
