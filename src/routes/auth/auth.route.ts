import express from 'express'
import { register, login, logout } from '../../controllers/auth.controller'
import passport from 'passport'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)
authRouter.get(
  '/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE' })
)
authRouter.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)
export default authRouter
