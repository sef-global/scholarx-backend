import { z } from 'zod'
import { MentorApplicationStatus } from '../../enums'

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
