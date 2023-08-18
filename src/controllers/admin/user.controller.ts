import type { Request, Response } from 'express'
import { getAllUsers } from '../../services/admin.service'

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await getAllUsers(req)
    if (users?.length === 0) {
      return res.status(404).json({ message: 'No users available' })
    } else {
      return res.status(200).json({ profiles: users })
    }
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}
