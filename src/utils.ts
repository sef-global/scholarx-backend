import { JWT_SECRET } from './configs/envConfig'
import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import type Mentor from './entities/mentor.entity'
import path from 'path'
import multer from 'multer'
import ejs from 'ejs'
import { ApplicationStatus } from './enums'

export const signAndSetCookie = (res: Response, uuid: string): void => {
  const token = jwt.sign({ userId: uuid }, JWT_SECRET ?? '')

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000,
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

export const loadTemplate = (
  templateName: string,
  data: {
    subject: string
    message: string
  }
): any => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.ejs`)

  return new Promise<string>((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err) {
        reject(err)
      } else {
        resolve(str)
      }
    })
  })
}

export const getEmailContent = (
  type: 'mentor' | 'mentee',
  status: ApplicationStatus,
  name: string
): { subject: string; message: string } | undefined => {
  if (type === 'mentor') {
    switch (status) {
      case ApplicationStatus.PENDING:
        return {
          subject: 'Your ScholarX Mentor Application Status',
          message: `Dear ${name},<br /><br />
          Thank you very much for applying to ScholarX. Your application has been received. Our team will soon review your application, and we will keep you posted on the progress via email. 
          Please reach out to us via <a href="mailto:sustainableedufoundation@gmail.com">sustainableedufoundation@gmail.com</a> for any clarifications. To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      case ApplicationStatus.APPROVED:
        return {
          subject:
            'Congratulations! You have been selected as a ScholarX Mentor',
          message: `Dear ${name},<br /><br />
          I hope this email finds you in high spirits! I am delighted to inform you that you have been selected as a mentor for ScholarX, and we extend our heartfelt congratulations to you! <br /><br />
          We received a large number of qualified applicants, and after a thorough review of all candidates, we are thrilled to invite you to accept a place in our program. Your profile stood out amongst the others, and we are confident that you will contribute positively to our program.<br /><br />
          We understand that your hard work and dedication have brought you to this moment, and we recognize your exceptional talent, experience, and potential in your respective fields. We are excited to have you join our community of learners and scholars.<br /><br />
          We look forward to seeing the unique perspective and insights you will bring to the mentees and to the program. We believe that you will flourish in this year's edition of ScholarX, and we are thrilled to be a part of your academic or professional journey.<br /><br />
          Once again, congratulations on your selection! We cannot wait to have you on board. We will keep you informed on the next steps, and in the meantime would like to invite you to go through some of the resources that would be useful to thrive as a great mentor in ScholarX. <br /><br />
          To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      case ApplicationStatus.REJECTED:
        return {
          subject: 'ScholarX Mentor Application Status Update',
          message: `Dear ${name},<br /><br />
          I hope this email finds you well. I wanted to take a moment to thank you for your interest in joining ScholarX as a mentor and for submitting your application. We appreciate the time and effort you put into it.<br /><br />
          After careful review of your application and considering all of the candidates, we regret to inform you that we are unable to make you part of the mentor base at this time. We received a large number of qualified applicants, and unfortunately, we could only accept a limited number of mentors.<br /><br />
          We understand that this news may be disappointing, and we encourage you not to be discouraged by this decision. Please know that this does not reflect on your abilities, potential, or value as an individual. As you progress ahead on your academic or professional journey, we would be glad to have you as a mentor for future ScholarX programs.<br /><br />
          We appreciate your interest in our program and would like to wish you all the best in your future endeavors. We are grateful for the opportunity to consider you for our program and encourage you to keep pursuing your goals and aspirations.<br /><br />
          Thank you again for considering our program and for the time you invested in your application. We hope you find success and fulfillment in your academic and professional pursuits. To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      default:
        return undefined
    }
  } else {
    switch (status) {
      case ApplicationStatus.PENDING:
        return {
          subject: 'Your ScholarX Mentee Application Status',
          message: `Dear ${name},<br /><br />
          Thank you very much for applying to ScholarX. Your application has been received. Mentor will soon review your application and we will keep you posted on the progress via email. Until then, read more about student experience <a href="https://medium.com/search?q=scholarx">here</a> and reach out to us via <a href="mailto:sustainableedufoundation@gmail.com">sustainableedufoundation@gmail.com</a> for any clarifications. To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      case ApplicationStatus.APPROVED:
        return {
          subject: 'Congratulations! You have been selected for ScholarX',
          message: `Dear ${name},<br /><br />
          We are delighted to inform you that you have been selected for our undergraduate program, and we extend our heartfelt congratulations to you!<br /><br />
          We received a large number of qualified applicants, and after a thorough review of all candidates, we are thrilled to offer you a place in our program. Your application stood out amongst the others, and we are confident that you will contribute positively to our program.<br /><br />
          We believe that you have great potential to succeed in your academic and professional pursuits, and we are excited to have you join our community of learners and scholars.<br /><br />
          To emphasize the importance of completing the program, you have received a valuable opportunity. If, for any reason, you are uncertain about completing the program within the 6-month timeline, please inform our admissions team as soon as possible, so we can provide the opportunity to another deserving student.<br /><br />
          Once again, congratulations on your selection! We cannot wait to have you on board. To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      case ApplicationStatus.REJECTED:
        return {
          subject: 'ScholarX Mentee Application Status Update',
          message: `Dear ${name},<br /><br />
          We wanted to take a moment to thank you for your interest in the ScholarX program and for submitting your application. We appreciate the time and effort you put into it.<br /><br />
          After a careful review of your application and considering all of the candidates, we regret to inform you that we are unable to offer you admission at this time. We received a large number of qualified applicants, and unfortunately, we could only accept a limited number of students.<br /><br />
          However, we want to encourage you not to be discouraged by this decision. We recognize that the admissions process can be competitive, and we understand that this news may be disappointing. Please know that this does not reflect on your abilities, potential, or value as an individual.<br /><br />
          We do offer the possibility for you to apply again next time if you meet the eligibility criteria. We invite you to stay engaged with us by attending our events, reaching out to our admissions team, and taking advantage of any opportunities to connect with our current students and alumni.<br /><br />
          Thank you again for considering our program and for the time you invested in your application. We wish you all the best in your future endeavours. To ensure that you receive our emails and they do not go to your spam folder, please add sustainableedufoundation@gmail.com to your email whitelist.`
        }
      default:
        return undefined
    }
  }
}
