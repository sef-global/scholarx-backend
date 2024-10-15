import express from 'express'
import {
  getAllMentorEmails,
  getAllMentorsByStatus,
  mentorDetailsHandler,
  mentorStatusHandler,
  searchMentors,
  updateMentorAvailability,
  updateMentorHandler
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
import { paginationSchema } from '../../../schemas/common/pagination-request.schema'

const mentorRouter = express.Router()

mentorRouter.put('/:mentorId', requireAuth, updateMentorHandler)
mentorRouter.put(
  '/:mentorId/state',
  [requireAuth, requestBodyValidator(mentorStatusSchema)],
  mentorStatusHandler
)
mentorRouter.get(
  '/',
  [
    requireAuth,
    requestQueryValidator(getAllMentorsByStatusSchema.merge(paginationSchema))
  ],
  getAllMentorsByStatus
)
mentorRouter.get(
  '/emails',
  [requireAuth, requestQueryValidator(getAllMentorEmailsSchema)],
  getAllMentorEmails
)
mentorRouter.get('/:mentorId', requireAuth, mentorDetailsHandler)
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
