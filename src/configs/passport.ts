import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { dataSource } from './dbConfig'
import Profile from '../entities/profile.entity'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,JWT_SECRET } from './envConfig'
import type { Request } from 'express'
import { register } from '../controllers/auth.controller'

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
  new GoogleStrategy(
    {
      callbackURL: 'http://localhost:3000/api/auth/google/redirect',
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      done(null, profile)
      // try {
      //   const profileRepository = dataSource.getRepository(Profile)
      //   var currentProfile = profile
      //   if (currentProfile.emails && currentProfile.emails.length > 0) {
      //     var emails = currentProfile.emails
      //     var userEmail = emails[0].value
      //     console.log(userEmail)
      //     const existingProfile = await profileRepository.findOne({
      //       where: { primary_email: userEmail }
      //     })
      //     if (existingProfile != null) {
      //       done(null, existingProfile)
      //     }else{
      //       done(null, currentProfile)
      //     }
      // }
      // } catch (error) {}
    }
  )
)

export default passport
