import type { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser } from '../services/auth.service'
import passport from 'passport'
import type Profile from '../entities/profile.entity'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../configs/envConfig'
import type { ApiResponse, User } from '../types'
import { signAndSetCookie } from '../utils'

export const googleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    'google',
    { failureRedirect: '/login' },
    (err: Error, user: User, profile: Profile) => {
      if (err) {
        next(err)
        return
      }
      if (!user) {
        res.redirect('/login')
        return
      }

      signAndSetCookie(res, profile.uuid)

      res.redirect(process.env.CLIENT_URL ?? '/')
    }
  )(req, res, next)
}

export const register = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required fields' })
    }

    const { statusCode, message, profile } = await registerUser(email, password)
    return res.status(statusCode).json({ message, profile })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
    throw err
  }
}

export const login = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required fields' })
    }

    const { statusCode, message, user } = await loginUser(email, password)

    if (user?.uuid) {
      signAndSetCookie(res, user.uuid)
    }

    return res.status(statusCode).json({ user, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const logout = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    res.clearCookie('jwt', { httpOnly: true })
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Something went wrong', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: Profile) => {
      if (err) {
        next(err)
        return
      }

      const token = req.cookies.jwt

      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      try {
        jwt.verify(token, JWT_SECRET)
      } catch (err) {
        return res
          .status(401)
          .json({ error: 'Invalid token, please log in again' })
      }

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
      } else {
        req.user = user
        next()
      }
    }
  )(req, res, next)
}
