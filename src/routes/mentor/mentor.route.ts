import express from 'express'
import { requireAuth } from './../../controllers/auth.controller'
import {
  mentorApplicationHandler,
  mentorAvailabilityHandler
} from './../../controllers/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.post('/', requireAuth, mentorApplicationHandler)
mentorRouter.put('/me/availability', requireAuth, mentorAvailabilityHandler)

export default mentorRouter
