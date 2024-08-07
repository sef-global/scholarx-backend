import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import {
  deleteProfileHandler,
  getApplicationsHandler,
  getProfileHandler,
  updateProfileHandler
} from '../../controllers/profile.controller'
import {
  requestBodyValidator,
  requestQueryValidator
} from '../../middlewares/requestValidator'
import {
  getApplicationsSchema,
  updateProfileSchema
} from '../../schemas/profile-routes.schema'

const profileRouter = express.Router()

profileRouter.get('/profile', requireAuth, getProfileHandler)
profileRouter.put(
  '/profile',
  [requireAuth, requestBodyValidator(updateProfileSchema)],
  updateProfileHandler
)
profileRouter.delete('/profile', requireAuth, deleteProfileHandler)
profileRouter.get(
  '/applications',
  [requireAuth, requestQueryValidator(getApplicationsSchema)],
  getApplicationsHandler
)

export default profileRouter
