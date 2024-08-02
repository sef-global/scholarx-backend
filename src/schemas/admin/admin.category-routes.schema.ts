import { z } from 'zod'

export const addCategorySchema = z.object({
  categoryName: z.string()
})

export const updateCategorySchema = z.object({
  categoryName: z.string()
})
