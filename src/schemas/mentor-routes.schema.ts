import { z } from 'zod'
import { MentorApplicationStatus } from '../enums'

export const mentorApplicationSchema = z.object({
  application: z.record(z.unknown()),
  categoryId: z.string(),
  countryId: z.string().optional()
})

export const getMenteesByMentorSchema = z.object({
  status: z.nativeEnum(MentorApplicationStatus).or(z.undefined())
})
