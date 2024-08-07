import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import {
  getMenteeDetails,
  menteeApplicationHandler,
  updateMenteeStatus
} from '../../controllers/mentee.controller'
import { requestBodyValidator } from '../../middlewares/requestValidator'
import {
  menteeApplicationSchema,
  updateMenteeStatusSchema
} from '../../schemas/mentee-routes.schemas'

const menteeRouter = express.Router()

menteeRouter.post(
  '/',
  [requireAuth, requestBodyValidator(menteeApplicationSchema)],
  menteeApplicationHandler
)
menteeRouter.get('/:menteeId', getMenteeDetails)
menteeRouter.put(
  '/:menteeId/status/',
  [requireAuth, requestBodyValidator(updateMenteeStatusSchema)],
  updateMenteeStatus
)

export default menteeRouter
