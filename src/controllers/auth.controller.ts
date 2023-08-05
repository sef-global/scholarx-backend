import { dataSource } from '../configs/dbConfig'
import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import passport from 'passport'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from '../configs/envConfig'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required fields' })
    }

    const profileRepository = dataSource.getRepository(Profile)

    const existingProfile = await profileRepository.findOne({
      where: { primary_email: email }
    })
    if (existingProfile != null) {
      res.status(409).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newProfile = profileRepository.create({
      primary_email: email,
      password: hashedPassword,
      contact_email: '',
      first_name: '',
      last_name: '',
      image_url: '',
      linkedin_url: ''
    })
    await profileRepository.save(newProfile)

    res.status(201).json({
      uuid: newProfile.uuid,
      primary_email: newProfile.primary_email,
      contact_email: newProfile.contact_email,
      first_name: newProfile.first_name,
      last_name: newProfile.last_name,
      image_url: newProfile.image_url,
      linkedin_url: newProfile.linkedin_url
    })
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required fields' })
    }

    const profileRepository = dataSource.getRepository(Profile)
    const profile = await profileRepository
      .createQueryBuilder('profile')
      .addSelect('profile.password')
      .where({ primary_email: email })
      .getOne()

    if (profile == null) {
      res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await profile?.comparePassword(password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: profile?.uuid }, JWT_SECRET ?? '', {
      expiresIn: '10h' // To-Do: Change value in production
    })
    res.json({ token })
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
