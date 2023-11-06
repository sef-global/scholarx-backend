import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  addEmailTemplate,
  getEmailTemplate
} from '../../../controllers/admin/emailTemplate.controller'

const emailTemplateRouter = express.Router()

emailTemplateRouter.post('/', requireAuth, addEmailTemplate)
emailTemplateRouter.get('/:templateId', requireAuth, getEmailTemplate)

export default emailTemplateRouter
