import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { dataSource } from './dbConfig'
import Profile from '../entities/profile.entity'
import { JWT_SECRET, LINKEDIN_KEY, LINKEDIN_SECRET } from './envConfig'
import type { Request } from 'express'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import type { LinkedInUser } from '../types'

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

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_KEY,
      clientSecret: LINKEDIN_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user: LinkedInUser, done) => {
  done(null, user)
})

export default passport
