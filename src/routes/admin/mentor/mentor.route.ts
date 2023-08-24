import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { mentorStatusHandler } from '../../../controllers/admin/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.put('/:mentorId/status', requireAuth, mentorStatusHandler)

export default mentorRouter
