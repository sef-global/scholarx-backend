import express from 'express'
import {
  register,
  login,
  logout,
  googleRedirect
} from '../../controllers/auth.controller'
import passport from 'passport'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

authRouter.get('/google/callback', googleRedirect)
export default authRouter
