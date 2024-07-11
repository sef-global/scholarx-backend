import type { Request } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import Profile from '../entities/profile.entity'
import { dataSource } from './dbConfig'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  JWT_SECRET
} from './envConfig'

import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { findOrCreateUser } from '../services/auth.service'
import { CreateProfile, type User } from '../types'

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: passport.Profile,
      done: (err: Error | null, user?: Profile) => void
    ) {
      try {
        const createProfile: CreateProfile = {
          id: profile.id,
          primary_email: profile.emails?.[0]?.value ?? '',
          first_name: profile.name?.givenName ?? '',
          last_name: profile.name?.familyName ?? '',
          image_url: profile.photos?.[0]?.value ?? ''
        }
        const user = await findOrCreateUser(createProfile)
        done(null, user)
      } catch (err) {
        done(err as Error)
      }
    }
  )
)

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).primary_email)
})

passport.deserializeUser(async (primary_email: string, done) => {
  try {
    const profileRepository = dataSource.getRepository(Profile)
    const user = await profileRepository.findOne({
      where: { primary_email },
      relations: ['mentor', 'mentee']
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const cookieExtractor = (req: Request): string => {
  let token = null
  if (req?.cookies) {
    token = req.cookies.jwt
  }
  return token
}

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
}

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const profileRepository = dataSource.getRepository(Profile)
      const profile = await profileRepository.findOne({
        where: { uuid: jwtPayload.userId },
        relations: ['mentor', 'mentee']
      })

      if (!profile) {
        done(null, false)
      } else {
        done(null, profile)
      }
    } catch (error) {
      done(error, false)
    }
  })
)

export default passport
