import type { Request, Response } from 'express'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { createCategory } from '../../services/admin/category.service'
import type Category from '../../entities/category.entity'
import { ApiResponse } from '../../types'

export const addCategory = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Category>> => {
  try {
    const user = req.user as Profile
    const { categoryName } = req.body

    if (user.type !== ProfileTypes.ADMIN) {
      return res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      const { category, statusCode, message } = await createCategory(
        categoryName
      )

      return res.status(statusCode).json({ category, message })
    }
  } catch (err) {
    console.error('Error executing query', err)
    return res.status(500).json({ error: err })
  }
}
