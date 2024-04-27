import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import {
  menteeApplicationHandler,
  updateMenteeStatus
} from '../../controllers/mentee.controller'

const menteeRouter = express.Router()

menteeRouter.post('/', requireAuth, menteeApplicationHandler)
menteeRouter.put('/:menteeId/status/', requireAuth, updateMenteeStatus)

export default menteeRouter
