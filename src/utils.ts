import { JWT_SECRET } from './configs/envConfig'
import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import type Mentor from './entities/mentor.entity'
import path from 'path'
import multer from 'multer'

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

export const checkProfilePictureFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new Error('Error: Images Only!'))
  }
}

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // limit file size to 5MB
  fileFilter: (req, file, cb) => {
    checkProfilePictureFileType(file, cb)
  }
}).single('profile_image')
