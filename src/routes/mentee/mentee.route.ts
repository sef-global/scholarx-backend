import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import {
  getMenteeDetails,
  getPublicMenteeDetails,
  menteeApplicationHandler,
  revokeApplication,
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
menteeRouter.get('/:menteeId', requireAuth, getMenteeDetails)
menteeRouter.get('/public/:menteeId', getPublicMenteeDetails)
menteeRouter.put(
  '/:menteeId/status/',
  [requireAuth, requestBodyValidator(updateMenteeStatusSchema)],
  updateMenteeStatus
)
menteeRouter.put('/revoke-application', requireAuth, revokeApplication)

export default menteeRouter
