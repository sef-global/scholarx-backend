import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { dataSource } from './dbConfig'
import Profile from '../entities/profile.entity'
import {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_SECRET
} from './envConfig'
import type { Request } from 'express'

// Google Authencation Strategy  ----
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { findOrCreateUser } from '../services/auth.service'

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URL,
      scope: ['profile', 'email']
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await findOrCreateUser(profile)
        done(null, user)
      } catch (err) {
        done(err as Error)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.primary_email)
})

passport.deserializeUser(async (primary_email: string, done) => {
  try {
    const profileRepository = dataSource.getRepository(Profile)
    const user = await profileRepository.findOne({ where: { primary_email } })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// -----
const cookieExtractor = (req: Request): string => {
  let token = null
  if (req?.cookies) {
    token = req.cookies.jwt
  }
  return token
  console.log(token)
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
        where: { uuid: jwtPayload.userId }
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
