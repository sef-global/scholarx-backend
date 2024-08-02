import { z } from 'zod'
import { ApplicationStatus } from '../../enums'

export const getAllMenteeEmailsSchema = z.object({
  status: z.nativeEnum(ApplicationStatus)
})

export const getMenteesSchema = z.object({
  state: z.nativeEnum(ApplicationStatus)
})

export const updateMenteeStatusSchema = z.object({
  state: z.nativeEnum(ApplicationStatus)
})
