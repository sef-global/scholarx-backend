import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string()
})
