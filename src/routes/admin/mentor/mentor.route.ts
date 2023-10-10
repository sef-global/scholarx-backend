import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  getAllMentorEmails,
  getAllMentorsByStatus,
  mentorStatusHandler
} from '../../../controllers/admin/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.put('/:mentorId/status', requireAuth, mentorStatusHandler)
mentorRouter.get('/', requireAuth, getAllMentorsByStatus)
mentorRouter.get('/emails', requireAuth, getAllMentorEmails)

export default mentorRouter
