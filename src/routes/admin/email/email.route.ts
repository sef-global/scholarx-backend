import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { addEmailTemplate } from '../../../controllers/admin/email.controller'

const emailRouter = express.Router()

emailRouter.post('/templates', requireAuth, addEmailTemplate)

export default emailRouter
