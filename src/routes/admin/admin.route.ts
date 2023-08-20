import express from 'express'
import { getAllUsersHandler } from '../../controllers/admin/user.controller'
import { requireAuth } from '../../controllers/auth.controller'

const adminRouter = express.Router()

adminRouter.get('/users', requireAuth, getAllUsersHandler)

export default adminRouter
