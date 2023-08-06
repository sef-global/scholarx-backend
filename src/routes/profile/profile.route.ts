import express from 'express'
import {
  getProfileHandler,
  updateProfileHandler
} from '../../controllers/profile.controller'
import { requireAuth } from '../../controllers/auth.controller'

const profileRouter = express.Router()

profileRouter.get('/profile', requireAuth, getProfileHandler)
profileRouter.put('/profile', requireAuth, updateProfileHandler)

export default profileRouter
