import express from 'express'
import {
  processEmailReminderHandler,
  scheduleNewReminderHandler
} from '../../../controllers/admin/email.controller'

const reminderRouter = express.Router()

reminderRouter.get('/process', processEmailReminderHandler)
reminderRouter.get('/schedule', scheduleNewReminderHandler)

export default reminderRouter
