import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  getAllMentorEmails,
  getAllMentorsByStatus,
  mentorDetailsHandler,
  mentorStatusHandler,
  searchMentors,
  updateMentorAvailability
} from '../../../controllers/admin/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.put('/:mentorId/state', requireAuth, mentorStatusHandler)
mentorRouter.get('/:mentorId', requireAuth, mentorDetailsHandler)
mentorRouter.get('/', requireAuth, getAllMentorsByStatus)
mentorRouter.get('/emails', requireAuth, getAllMentorEmails)
mentorRouter.put(
  '/:mentorId/availability',
  requireAuth,
  updateMentorAvailability
)
mentorRouter.get('/search', requireAuth, searchMentors)

export default mentorRouter
