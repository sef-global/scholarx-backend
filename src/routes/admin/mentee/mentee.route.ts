import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { getAllMenteeEmails } from '../../../controllers/admin/email.controller'

const menteeRouter = express.Router()

menteeRouter.get('/emails/', /*requireAuth,*/ getAllMenteeEmails)

export default menteeRouter
