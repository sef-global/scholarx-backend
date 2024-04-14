import express from 'express'
import { requireAuth } from '../../controllers/auth.controller'
import { menteeApplicationHandler } from '../../controllers/mentee.controller'

const menteeRouter = express.Router()

menteeRouter.post('/', requireAuth, menteeApplicationHandler)

export default menteeRouter
