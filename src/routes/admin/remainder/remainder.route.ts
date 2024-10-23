import express from 'express'
import { enableEmailReminderHandler } from '../../../controllers/admin/email.controller'

const reminderRouter = express.Router()

reminderRouter.get('/', enableEmailReminderHandler)

export default reminderRouter
