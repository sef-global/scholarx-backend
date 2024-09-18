import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import {
  getMenteeDetails,
  getMonthlyCheckIns,
  getPublicMenteeDetails,
  menteeApplicationHandler,
  revokeApplication,
  submitMonthlyCheckIn,
  updateMenteeStatus
} from '../../controllers/mentee.controller'
import { requestBodyValidator } from '../../middlewares/requestValidator'
import {
  menteeApplicationSchema,
  submitMonthlyCheckInSchema,
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

menteeRouter.post(
  '/checkin',
  [requireAuth, requestBodyValidator(submitMonthlyCheckInSchema)],
  submitMonthlyCheckIn
)

menteeRouter.get('/:menteeId/checkin', requireAuth, getMonthlyCheckIns)
export default menteeRouter
