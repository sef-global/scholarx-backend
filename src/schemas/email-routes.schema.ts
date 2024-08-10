import { z } from 'zod'

export const sendEmailSchema = z.object({
  subject: z.string(),
  to: z.string(),
  text: z.string()
})
