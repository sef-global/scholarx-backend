import express from 'express'
import { requireAuth } from './../../controllers/auth.controller'
import { mentorApplicationHandler } from './../../controllers/mentor.controller'

const mentorRouter = express.Router()

mentorRouter.post('/', requireAuth, mentorApplicationHandler)

export default mentorRouter
