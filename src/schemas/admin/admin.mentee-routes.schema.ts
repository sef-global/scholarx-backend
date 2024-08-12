import { z } from 'zod'
import { MenteeApplicationStatus } from '../../enums'

export const getAllMenteeEmailsSchema = z.object({
  status: z.nativeEnum(MenteeApplicationStatus)
})

export const getMenteesSchema = z.object({
  state: z.nativeEnum(MenteeApplicationStatus).optional()
})

export const updateMenteeStatusSchema = z.object({
  state: z.nativeEnum(MenteeApplicationStatus)
})
