import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  getMentees,
  updateMenteeStatus,
  getAllMenteeEmails,
  getMenteeDetails
} from '../../../controllers/admin/mentee.controller'

const menteeRouter = express.Router()

menteeRouter.get('/', requireAuth, getMentees)
menteeRouter.get('/emails', requireAuth, getAllMenteeEmails)
// TODO: Remove this route
// menteeRouter.get('/applications', requireAuth, getMentees)
menteeRouter.get('/:menteeId', requireAuth, getMenteeDetails)
menteeRouter.put('/:menteeId/state', requireAuth, updateMenteeStatus)

export default menteeRouter
