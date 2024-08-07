import { z } from 'zod'

export const updateProfileSchema = z.object({
  primary_email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().url()
})

export const getApplicationsSchema = z.object({
  type: z.enum(['mentor', 'mentee'])
})
