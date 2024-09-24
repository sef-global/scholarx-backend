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
  postMonthlyCheckInSchema,
  updateMenteeStatusSchema
} from '../../schemas/mentee-routes.schemas'
import {
  addFeedbackMonthlyCheckIn,
  getMonthlyCheckIns,
  postMonthlyCheckIn
} from '../../controllers/monthlyChecking.controller'

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
  [requireAuth, requestBodyValidator(postMonthlyCheckInSchema)],
  postMonthlyCheckIn
)

menteeRouter.get('/checkin/:menteeId', requireAuth, getMonthlyCheckIns)

menteeRouter.put('/checking/feedback', requireAuth, addFeedbackMonthlyCheckIn)

export default menteeRouter
