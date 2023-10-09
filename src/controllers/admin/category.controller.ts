import type { Request, Response } from 'express'
import type Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import {
  changeCategory,
  createCategory
} from '../../services/admin/category.service'

export const addCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const { categoryName } = req.body

    if (user.type !== ProfileTypes.ADMIN) {
      res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      const { category, statusCode, message } = await createCategory(
        categoryName
      )

      res.status(statusCode).json({ category, message })
    }
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const { categoryName } = req.body
    const { categoryId } = req.params

    if (user.type !== ProfileTypes.ADMIN) {
      res.status(403).json({ message: 'Only Admins are allowed' })
    } else {
      const { category, statusCode, message } = await changeCategory(
        categoryId,
        categoryName
      )

      res.status(statusCode).json({ category, message })
    }
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: err })
  }
}
