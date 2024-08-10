import express from 'express'
import passport from 'passport'
import {
  googleRedirect,
  linkedinRedirect,
  login,
  logout,
  passwordReset,
  passwordResetRequest,
  register
} from '../../controllers/auth.controller'
import { requestBodyValidator } from '../../middlewares/requestValidator'
import { loginSchema, registerSchema } from '../../schemas/auth-routes.schems'

const authRouter = express.Router()

authRouter.post('/register', requestBodyValidator(registerSchema), register)
authRouter.post('/login', requestBodyValidator(loginSchema), login)
authRouter.get('/logout', logout)

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

authRouter.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    scope: ['openid', 'email', 'profile']
  })
)

authRouter.get('/google/callback', googleRedirect)
authRouter.get('/linkedin/callback', linkedinRedirect)
authRouter.post('/password-reset-request', passwordResetRequest)
authRouter.put('/passwordreset', passwordReset)
export default authRouter
