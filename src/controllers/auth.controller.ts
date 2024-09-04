import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { JWT_SECRET, REFRESH_JWT_SECRET } from '../configs/envConfig'
import type Profile from '../entities/profile.entity'
import {
  generateResetToken,
  loginUser,
  registerUser,
  resetPassword
} from '../services/auth.service'
import type { ApiResponse } from '../types'
import { signAndSetCookie } from '../utils'

export const googleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    'google',
    { failureRedirect: '/login' },
    (err: Error, user: Profile) => {
      if (err) {
        next(err)
        return
      }
      if (!user) {
        res.redirect('/login')
        return
      }
      signAndSetCookie(res, user.uuid)

      res.redirect(process.env.CLIENT_URL ?? '/')
    }
  )(req, res, next)
}

export const linkedinRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    'linkedin',
    { failureRedirect: '/login' },
    (err: Error, user: Profile) => {
      if (err) {
        next(err)
        return
      }
      if (!user) {
        res.redirect('/login')
        return
      }
      signAndSetCookie(res, user.uuid)

      res.redirect(process.env.CLIENT_URL ?? '/')
    }
  )(req, res, next)
}

export const register = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  try {
    const { email, password, first_name, last_name } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required fields' })
    }

    const { statusCode, message, profile } = await registerUser(
      email,
      password,
      first_name,
      last_name
    )

    const { user } = await loginUser(email, password)

    if (user?.uuid) {
      signAndSetCookie(res, user.uuid)
    }

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
    res.clearCookie('accessToken', { httpOnly: true })
    res.clearCookie('refreshToken', { httpOnly: true })
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

      const token = req.cookies.accessToken
      const refreshToken = req.cookies.refreshToken

      if (!token && !refreshToken) {
        return res
          .status(401)
          .json({ error: 'Access Denied. No token provided.' })
      }

      try {
        jwt.verify(token, JWT_SECRET)
      } catch (err) {
        if (!refreshToken) {
          return res.status(401).send('Access Denied. Please Login again.')
        }

        try {
          const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as {
            userId: string
          }

          signAndSetCookie(res, decoded.userId)
        } catch (error) {
          return res
            .status(401)
            .json({ error: 'Invalid token, please log in again' })
        }
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

export const passwordResetRequest = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Profile>> => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is a required field' })
  }

  try {
    const { statusCode, message, data: token } = await generateResetToken(email)
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
    const { statusCode, message } = await resetPassword(token, newPassword)
    res.status(statusCode).json({ message })
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({
      error: 'Internal server error',
      message: (err as Error).message
    })
  }
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as {
      userId: string
    }

    signAndSetCookie(res, decoded.userId)
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token, please log in again' })
  }
}
