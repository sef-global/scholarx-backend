import { JWT_SECRET } from './configs/envConfig'
import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import type Mentor from './entities/mentor.entity'

export const signAndSetCookie = (res: Response, uuid: string): void => {
  const token = jwt.sign({ userId: uuid }, JWT_SECRET ?? '', {
    expiresIn: '10h' // To-Do: Change value in production
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: false // TODO: Set to true when using HTTPS
  })
}

export const getMentorPublicData = (mentor: Mentor): Mentor => {
  const { application } = mentor
  delete application.cv
  delete application.contactNo
  delete application.email

  return mentor
}
