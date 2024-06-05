import express from 'express'
import {
  register,
  login,
  logout,
  googleRedirect,
  passwordResetRequest,
  passwordReset
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

authRouter.post('/password-reset-request', passwordResetRequest)
authRouter.put('/passwordreset', passwordReset)
export default authRouter
