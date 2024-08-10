import express from 'express'
import { sendEmailController } from '../../controllers/admin/email.controller'
import { requireAuth } from '../../controllers/auth.controller'
import { requestBodyValidator } from '../../middlewares/requestValidator'
import { sendEmailSchema } from '../../schemas/email-routes.schema'

const emailRouter = express.Router()

emailRouter.post(
  '/send',
  [requireAuth, requestBodyValidator(sendEmailSchema)],
  sendEmailController
)

export default emailRouter
