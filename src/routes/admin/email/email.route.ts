import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  addEmailTemplate,
  getEmailTemplate
} from '../../../controllers/admin/email.controller'

const emailRouter = express.Router()

emailRouter.post('/templates', requireAuth, addEmailTemplate)
emailRouter.get('/templates/:templateId', requireAuth, getEmailTemplate)

export default emailRouter
