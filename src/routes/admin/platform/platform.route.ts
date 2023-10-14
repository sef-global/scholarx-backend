import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { addPlatform } from '../../../controllers/admin/platform.controller'

const platformRouter = express.Router()

platformRouter.post('/', requireAuth, addPlatform)

export default platformRouter
