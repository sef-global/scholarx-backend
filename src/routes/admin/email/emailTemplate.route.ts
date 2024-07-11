import express from 'express'
import {
  addEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplate
} from '../../../controllers/admin/emailTemplate.controller'
import { requireAuth } from '../../../controllers/auth.controller'

const emailTemplateRouter = express.Router()

emailTemplateRouter.post('/', requireAuth, addEmailTemplate)
emailTemplateRouter.get('/:templateId', requireAuth, getEmailTemplate)
emailTemplateRouter.delete('/:templateId', requireAuth, deleteEmailTemplate)

export default emailTemplateRouter
