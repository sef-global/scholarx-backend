import { z } from 'zod'
import { MenteeApplicationStatus } from '../enums'

export const menteeApplicationSchema = z.object({
  application: z.record(z.unknown()),
  mentorId: z.string()
})

export const updateMenteeStatusSchema = z.object({
  state: z.nativeEnum(MenteeApplicationStatus)
})
