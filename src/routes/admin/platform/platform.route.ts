import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  addPlatform,
  getPlatform,
  updatePlatform
} from '../../../controllers/admin/platform.controller'

const platformRouter = express.Router()

platformRouter.post('/', requireAuth, addPlatform)
platformRouter.get('/', requireAuth, getPlatform)
platformRouter.put('/', requireAuth, updatePlatform)

export default platformRouter
