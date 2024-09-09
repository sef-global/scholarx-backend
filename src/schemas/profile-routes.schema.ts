import { z } from 'zod'

export const updateProfileSchema = z.object({
  primary_email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  image_url: z.string().url().optional()
})

export const getApplicationsSchema = z.object({
  type: z.enum(['mentor', 'mentee'])
})
