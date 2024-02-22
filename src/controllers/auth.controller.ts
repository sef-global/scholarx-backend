import type { Request, Response, NextFunction } from 'express'
import {
  registerUser,
  loginUser,
  resetPassword,
  generateResetToken
} from '../services/auth.service'
import passport from 'passport'
import type Profile from '../entities/profile.entity'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../configs/envConfig'
import type { ApiResponse, User } from '../types'

export const googleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    'google',
    { failureRedirect: '/login' },
    (err: Error, user: User, info: Profile) => {
      if (err) {
        next(err)
        return
      }
      if (!user) {
        res.redirect('/login')
        return
      }
      req.logIn(user, function (err) {
        if (err) {
          next(err)
          return
        }
        res.redirect('http://localhost:5173/')
      })
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

    const { statusCode, message, token } = await loginUser(email, password)

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false // TODO: Set to true when using HTTPS
    })

    return res.status(statusCode).json({ message })
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

      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

      if (decoded.exp && Date.now() > decoded.exp * 1000) {
        return res
          .status(401)
          .json({ error: 'Token expired, please log in again' })
      }

      if (!user) {
        return res.status(401).json({ message: 'Unauthorised' })
      } else {
        req.user = user
        next()
      }
    }
  )(req, res, next)
}

export const passwordResetRequest = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is a required field' })
  }

  try {
    const { statusCode, message, token } = await generateResetToken(email)
    return res.status(statusCode).json({ message, token })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Internal server error', message: (err as Error).message })
  }
}

export const passwordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      res
        .status(400)
        .json({ error: 'Token and new password are required fields' })
      return
    }

    const result = await resetPassword(token, newPassword)

    res.status(result.statusCode).json({ message: result.message })
  } catch (err) {
    console.error('Error executing query', err)
    res
      .status(500)
      .json({ error: 'Internal server error', message: (err as Error).message })
  }
}
