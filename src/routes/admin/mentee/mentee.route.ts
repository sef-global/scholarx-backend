import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { getAllMenteeEmails } from '../../../controllers/admin/email.controller'
import {
  getMentees,
  updateMenteeStatus
} from '../../../controllers/admin/mentee.controller'

const menteeRouter = express.Router()

menteeRouter.get('/emails/', requireAuth, getAllMenteeEmails)
menteeRouter.get('/applications', requireAuth, getMentees)
menteeRouter.put('/:menteeId/status/', requireAuth, updateMenteeStatus)

export default menteeRouter
