import express from 'express'
import { register, login, logout } from '../../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)

export default authRouter
