import type { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser } from '../services/auth.service'
import passport from 'passport'
import type Profile from '../entities/profile.entity'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required fields' })
    }

    const newUser = await registerUser(email, password)
    res.status(201).json(newUser)
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required fields' })
    }

    const tokenData = await loginUser(email, password)
    res.json(tokenData)
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: 'Internal server error' })
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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorised' })
      } else {
        req.user = user
        next()
      }
    }
  )(req, res, next)
}
