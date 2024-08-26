import { z } from 'zod'

export const paginationSchema = z.object({
  pageNumber: z.coerce.number().int().positive(),
  pageSize: z.coerce.number().int().positive().max(100)
})

export type PaginationRequest = z.infer<typeof paginationSchema>
