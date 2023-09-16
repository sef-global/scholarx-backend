import express from 'express'
import { getAllUsersHandler } from '../../../controllers/admin/user.controller'
import { requireAuth } from '../../../controllers/auth.controller'

const userRouter = express.Router()

userRouter.get('/', requireAuth, getAllUsersHandler)

export default userRouter
