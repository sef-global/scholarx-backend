import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
