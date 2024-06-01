import express from 'express'
import { sendEmailController } from '../../controllers/admin/email.controller'
import { requireAuth } from '../../controllers/auth.controller'

const emailRouter = express.Router()

emailRouter.post('/send', requireAuth, sendEmailController)

export default emailRouter
