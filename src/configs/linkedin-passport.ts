import type { Request } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import Profile from '../entities/profile.entity'
import { dataSource } from './dbConfig'
import {
  JWT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URL
} from './envConfig'

import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import { findOrCreateUser } from '../services/auth.service'
import { type CreateProfile, type User } from '../types'

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: LINKEDIN_REDIRECT_URL,
      scope: ['openid', 'email', 'profile'],
      passReqToCallback: true
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: Error | null, user?: Profile) => void
    ) {
      try {
        const createProfile: CreateProfile = {
          id: profile.id,
          primary_email: profile?.email ?? '',
          first_name: profile?.givenName ?? '',
          last_name: profile?.familyName ?? '',
          image_url: profile?.picture ?? ''
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
