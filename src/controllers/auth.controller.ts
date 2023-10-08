import type { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser } from '../services/auth.service'
import passport from 'passport'
import type Profile from '../entities/profile.entity'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../configs/envConfig'

interface AuthResponse {
  statusCode: number
  message?: string
  profile?: Profile | null
}

export const register = async (
  req: Request,
  res: Response
): Promise<AuthResponse> => {
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
): Promise<AuthResponse> => {
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
): Promise<AuthResponse> => {
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
