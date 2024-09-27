import { z } from 'zod'
import { MenteeApplicationStatus } from '../enums'

export const menteeApplicationSchema = z.object({
  application: z.record(z.unknown()),
  mentorId: z.string()
})

export const updateMenteeStatusSchema = z.object({
  state: z.nativeEnum(MenteeApplicationStatus)
})

export const postMonthlyCheckInSchema = z.object({
  menteeId: z.string(),
  title: z.enum([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]),
  generalUpdatesAndFeedback: z
    .string()
    .min(1, 'Please provide a valid feedback'),
  progressTowardsGoals: z
    .string()
    .min(1, 'Please provide a valid progress report'),
  mediaContentLinks: z
    .array(z.string())
    .min(3, 'Please provide at least 3 media content links')
})

export const addFeedbackMonthlyCheckInSchema = z.object({
  menteeId: z.string(),
  checkInId: z.string(),
  mentorFeedback: z.string().min(1, 'Please provide a valid feedback'),
  isCheckedByMentor: z.boolean()
})
