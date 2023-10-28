import express from 'express'
import { register, login, logout, googleAuth } from '../../controllers/auth.controller'
import passport from 'passport'
const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)
authRouter.get(
  '/google/redirect',
  passport.authenticate('google',{
    failureRedirect: 'https://google.com', 
  }),
  googleAuth
)
authRouter.get('/logout', logout)

export default authRouter
