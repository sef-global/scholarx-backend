import express from 'express'
import {
  requestBodyValidator,
  requestQueryValidator
} from '../../middlewares/requestValidator'
import { paginationSchema } from '../../schemas/common/pagination-request.schema'
import {
  getMenteesByMentorSchema,
  mentorApplicationSchema
} from '../../schemas/mentor-routes.schema'
import { requireAuth } from './../../controllers/auth.controller'
import {
  getAllMentorsHandler,
  getMenteesByMentor,
  mentorApplicationHandler,
  mentorAvailabilityHandler,
  mentorDetailsHandler
} from './../../controllers/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.post(
  '/',
  [requireAuth, requestBodyValidator(mentorApplicationSchema)],
  mentorApplicationHandler
)
mentorRouter.get(
  '/mentees',
  [requireAuth, requestQueryValidator(getMenteesByMentorSchema)],
  getMenteesByMentor
)
mentorRouter.put(
  '/:mentorId/availability',
  requireAuth,
  mentorAvailabilityHandler
)
mentorRouter.get('/:mentorId', mentorDetailsHandler)
mentorRouter.get(
  '/',
  requestQueryValidator(paginationSchema),
  getAllMentorsHandler
)

export default mentorRouter
