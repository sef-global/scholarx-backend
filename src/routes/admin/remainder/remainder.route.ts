import express from 'express'
import { processEmailReminderHandler } from '../../../controllers/admin/email.controller'

const reminderRouter = express.Router()

reminderRouter.get('/process', processEmailReminderHandler)

export default reminderRouter
