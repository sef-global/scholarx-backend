import { z } from 'zod'
import { MentorApplicationStatus } from '../../enums'
import { updateProfileSchema } from '../profile-routes.schema'

export const mentorStatusSchema = z.object({
  state: z.nativeEnum(MentorApplicationStatus)
})

export const getAllMentorsByStatusSchema = z.object({
  status: z.nativeEnum(MentorApplicationStatus).or(z.undefined())
})

export const getAllMentorEmailsSchema = z.object({
  status: z.nativeEnum(MentorApplicationStatus).or(z.undefined())
})

export const updateMentorAvailabilitySchema = z.object({
  availability: z.boolean()
})

export const searchMentorsSchema = z.object({
  q: z.string().or(z.undefined())
})

export const mentorUpdateSchema = z.object({
  availability: z.boolean().optional(),
  application: z.record(z.string(), z.any()).optional(),
  category: z.string().uuid().optional(),
  profile: updateProfileSchema.optional()
})
