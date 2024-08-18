import type { Request, Response } from 'express'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { getAllUsers } from '../../services/admin/user.service'
import type { PaginatedApiResponse } from '../../types'

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<Response<PaginatedApiResponse<Profile>>> => {
  try {
    const user = req.user as Profile

    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    }

    const { items, message, statusCode, totalItemCount } = await getAllUsers({
      pageNumber,
      pageSize
    })

    return res.status(statusCode).json({
      items,
      message,
      pageNumber,
      pageSize,
      totalItemCount
    })
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
