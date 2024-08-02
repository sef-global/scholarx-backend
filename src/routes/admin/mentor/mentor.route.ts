import express from 'express'
import {
  getAllMentorEmails,
  getAllMentorsByStatus,
  mentorDetailsHandler,
  mentorStatusHandler,
  searchMentors,
  updateMentorAvailability
} from '../../../controllers/admin/mentor.controller'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  requestBodyValidator,
  requestQueryValidator
} from '../../../middlewares/requestValidator'
import {
  getAllMentorEmailsSchema,
  getAllMentorsByStatusSchema,
  mentorStatusSchema,
  searchMentorsSchema,
  updateMentorAvailabilitySchema
} from '../../../schemas/admin/admin.mentor-routes.schema'

const mentorRouter = express.Router()

mentorRouter.put(
  '/:mentorId/state',
  [requireAuth, requestBodyValidator(mentorStatusSchema)],
  mentorStatusHandler
)
mentorRouter.get('/:mentorId', requireAuth, mentorDetailsHandler)
mentorRouter.get(
  '/',
  [requireAuth, requestQueryValidator(getAllMentorsByStatusSchema)],
  getAllMentorsByStatus
)
mentorRouter.get(
  '/emails',
  [requireAuth, requestQueryValidator(getAllMentorEmailsSchema)],
  getAllMentorEmails
)
mentorRouter.put(
  '/:mentorId/availability',
  [requireAuth, requestBodyValidator(updateMentorAvailabilitySchema)],
  updateMentorAvailability
)
mentorRouter.get(
  '/search',
  [requireAuth, requestQueryValidator(searchMentorsSchema)],
  searchMentors
)

export default mentorRouter
