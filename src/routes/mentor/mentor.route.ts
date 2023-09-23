import express from 'express'
import { requireAuth } from './../../controllers/auth.controller'
import {
  mentorApplicationHandler,
  mentorAvailabilityHandler,
  mentorDetailsHandler
} from './../../controllers/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.post('/', requireAuth, mentorApplicationHandler)
mentorRouter.put('/me/availability', requireAuth, mentorAvailabilityHandler)
mentorRouter.get('/:mentorId', mentorDetailsHandler)

export default mentorRouter
