import { randomUUID } from 'crypto'
import ejs from 'ejs'
import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import { certificatesDir } from './app'
import { CLIENT_URL, JWT_SECRET, REFRESH_JWT_SECRET } from './configs/envConfig'
import type Mentee from './entities/mentee.entity'
import type Mentor from './entities/mentor.entity'
import { MenteeApplicationStatus, MentorApplicationStatus } from './enums'
import { generateCertificate } from './services/admin/generateCertificate'

const generateAccessToken = (uuid: string): string => {
  return jwt.sign({ userId: uuid }, JWT_SECRET ?? '')
}

const generateRefreshToken = (uuid: string): string => {
  return jwt.sign({ userId: uuid }, REFRESH_JWT_SECRET ?? '', {
    expiresIn: '10d'
  })
}

export const signAndSetCookie = (res: Response, uuid: string): void => {
  const accessToken = generateAccessToken(uuid)
  const refreshToken = generateRefreshToken(uuid)

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000,
    secure: false // TODO: Set to true when using HTTPS
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    secure: false // TODO: Set to true when using HTTPS
  })
}

export const setAccessToken = (res: Response, uuid: string): void => {
  const accessToken = generateAccessToken(uuid)

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000,
    secure: false // TODO: Set to true when using HTTPS
  })
}

export const getMentorPublicData = (mentor: Mentor): Mentor => {
  const { application, profile } = mentor

  delete application.cv
  delete application.contactNo
  delete application.email
  delete application.motivation
  delete application.reasonToMentor

  delete profile.created_at
  delete profile.updated_at

  if (mentor.mentees) {
    mentor.mentees = mentor.mentees.map((mentee) => {
      return getMenteePublicData(mentee)
    })
  }

  return mentor
}

export const getMenteePublicData = (mentee: Mentee): Mentee => {
  const { application, profile } = mentee

  delete application.cv
  delete application.contactNo
  delete application.email
  delete application.submission
  delete application.consentGiven

  delete profile.created_at
  delete profile.updated_at

  if (mentee.mentor) {
    mentee.mentor = getMentorPublicData(mentee.mentor)
  }

  return mentee
}

export const checkProfilePictureFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const filetypes = /jpeg|jpg|webp|png|gif/
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

export const getEmailContent = async (
  type: 'mentor' | 'mentee',
  status: MenteeApplicationStatus | MentorApplicationStatus,
  name: string
): Promise<
  | {
      subject: string
      message: string
      attachment?: Array<{ filename: string; path: string }>
      uniqueId?: string
    }
  | undefined
> => {
  if (type === 'mentor') {
    switch (status) {
      case MentorApplicationStatus.PENDING:
        return {
          subject: 'Thank you very much for applying to ScholarX',
          message: `Dear ${name},<br /><br />
          Thank you very much for applying to ScholarX. Your application has been received. Our team will soon review your application, and we will keep you posted on the progress via email.
          Please reach out to us via <a href="mailto:sustainableedufoundation@gmail.com">sustainableedufoundation@gmail.com</a> for any clarifications.`
        }
      case MentorApplicationStatus.APPROVED:
        return {
          subject:
            'Congratulations! You have been selected as a ScholarX Mentor',
          message: `Dear ${name},<br /><br />
            I hope this email finds you in high spirits! I am delighted to inform you that you have been selected as a mentor for ScholarX, and we extend our heartfelt congratulations to you! <br /><br />
            We received a large number of qualified applicants, and after a thorough review of all candidates, we are thrilled to invite you to accept a place in our program. Your profile stood out amongst the others, and we are confident that you will contribute positively to our program.<br /><br />
            We understand that your hard work and dedication have brought you to this moment, and we recognize your exceptional talent, experience, and potential in your respective fields. We are excited to have you join our community of learners and scholars.<br /><br />
            We look forward to seeing the unique perspective and insights you will bring to the mentees and to the program. We believe that you will flourish in this year's edition of ScholarX, and we are thrilled to be a part of your academic or professional journey.<br /><br />
            Once again, congratulations on your selection! We cannot wait to have you on board. We will keep you informed on the next steps, and in the meantime, we would like to invite you to go through some of the resources that would be useful to thrive as a great mentor in ScholarX.<br /><br />
            <strong>Important:</strong> To help you get started and to provide all the necessary information you will need, please carefully read the <strong>Mentor Guide</strong>. This guide contains crucial details about the program and your responsibilities. You can access the Mentor Guide using the link below:<br /><br />
            <a
              href="https://docs.google.com/document/d/1uMMcGWJ35nblOj1zZ1XzJuYm-LOi1Lyj02yYRNsaOkY/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"
            >
              Read the Mentor Guide
            </a><br /><br />
            Please ensure you review this guide thoroughly to understand the next steps and to prepare for your journey with us.`
        }

      case MentorApplicationStatus.REJECTED:
        return {
          subject: 'Thank You for Your Interest in the ScholarX Program',
          message: `Dear ${name},<br /><br />
          I hope this email finds you well. I wanted to take a moment to thank you for your interest in joining ScholarX as a mentor and for submitting your application. We appreciate the time and effort you put into it.<br /><br />
          After careful review of your application and considering all of the candidates, we regret to inform you that we are unable to make you part of the mentor base at this time. We received a large number of qualified applicants, and unfortunately, we could only accept a limited number of mentors.<br /><br />
          We understand that this news may be disappointing, and we encourage you not to be discouraged by this decision. Please know that this does not reflect on your abilities, potential, or value as an individual. As you progress ahead on your academic or professional journey, we would be glad to have you as a mentor for future ScholarX programs.<br /><br />
          We appreciate your interest in our program and would like to wish you all the best in your future endeavors. We are grateful for the opportunity to consider you for our program and encourage you to keep pursuing your goals and aspirations.<br /><br />
          Thank you again for considering our program and for the time you invested in your application. We hope you find success and fulfillment in your academic and professional pursuits. `
        }
      default:
        return undefined
    }
  } else {
    switch (status) {
      case MenteeApplicationStatus.PENDING:
        return {
          subject: 'Thank you very much for applying to ScholarX',
          message: `Dear ${name},<br /><br />
          Thank you very much for applying to ScholarX. Your application has been received. Mentor will soon review your application and we will keep you posted on the progress via email. Until then, read more about student experience <a href="https://medium.com/search?q=scholarx">here</a> and reach out to us via <a href="mailto:sustainableedufoundation@gmail.com">sustainableedufoundation@gmail.com</a> for any clarifications. `
        }
      case MenteeApplicationStatus.APPROVED:
        return {
          subject: 'Congratulations! You have been selected for ScholarX',
          message: `Dear ${name},<br /><br />
            We are delighted to inform you that you have been selected for our undergraduate program, and we extend our heartfelt congratulations to you!<br /><br />
            We received a large number of qualified applicants, and after a thorough review of all candidates, we are thrilled to offer you a place in our program. Your application stood out amongst the others, and we are confident that you will contribute positively to our program.<br /><br />
            We believe that you have great potential to succeed in your academic and professional pursuits, and we are excited to have you join our community of learners and scholars.<br /><br />
            To emphasize the importance of completing the program, you have received a valuable opportunity. If, for any reason, you are uncertain about completing the program within the 6-month timeline, please inform our admissions team as soon as possible, so we can provide the opportunity to another deserving student.<br /><br />
            Once again, congratulations on your selection! We cannot wait to have you on board.<br /><br />
            <strong>Important:</strong> To help you get started and to provide all the necessary information you will need, please carefully read the <strong>Mentee Guide</strong>. This guide contains crucial details about the program, your responsibilities, and how to make the most of this opportunity. You can access the Mentee Guide using the link below:<br /><br />
            <a
              href="https://docs.google.com/document/d/1gIYte14FIQtqUhGiMErZRovhNErdUrFdQ0LnCFFnfag/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"
            >
              Read the Mentee Guide
            </a><br /><br />
            Please ensure you review this guide thoroughly to understand the next steps and to prepare for your journey with us.`
        }
      case MenteeApplicationStatus.REJECTED:
        return {
          subject: 'Thank You for Your Interest in the ScholarX Program',
          message: `Dear ${name},<br /><br />
          We wanted to take a moment to thank you for your interest in the ScholarX program and for submitting your application. We appreciate the time and effort you put into it.<br /><br />
          After a careful review of your application and considering all of the candidates, we regret to inform you that we are unable to offer you admission at this time. We received a large number of qualified applicants, and unfortunately, we could only accept a limited number of students.<br /><br />
          However, we want to encourage you not to be discouraged by this decision. We recognize that the admissions process can be competitive, and we understand that this news may be disappointing. Please know that this does not reflect on your abilities, potential, or value as an individual.<br /><br />
          We do offer the possibility for you to apply again next time if you meet the eligibility criteria. We invite you to stay engaged with us by attending our events, reaching out to our admissions team, and taking advantage of any opportunities to connect with our current students and alumni.<br /><br />
          Thank you again for considering our program and for the time you invested in your application. We wish you all the best in your future endeavours.`
        }
      case MenteeApplicationStatus.COMPLETED: {
        const templatePath = path.join(
          __dirname,
          'templates',
          'certificateTemplate.pdf'
        )

        const uniqueId = randomUUID()
        const pdfFileName = await generateCertificate(
          name,
          templatePath,
          path.join(certificatesDir, `${uniqueId}_certificate.pdf`)
        )
        return {
          subject: 'Congratulations! You have completed ScholarX',
          message: `Dear ${name},<br /><br />
            We are delighted to inform you that you have successfully completed the ScholarX program. We extend our heartfelt congratulations to you!<br /><br />
            We are proud of your dedication, hard work, and commitment to the program. You have demonstrated exceptional talent, and we are confident that you will go on to achieve great success in your academic and professional pursuits.<br /><br />
            To commemorate your achievement, we have attached your certificate of completion. Please download and save the certificate for your records.<br /><br />
            We look forward to seeing the unique perspective and insights you will bring to the program. We believe that you will flourish in this year's edition of ScholarX, and we are thrilled to be a part of your academic or professional journey.<br /><br />
            Once again, congratulations on your completion! We cannot wait to see the great things you will achieve in the future.`,
          attachment: [
            {
              filename: `${name}_certificate.pdf`,
              path: pdfFileName
            }
          ],
          uniqueId
        }
      }
      default:
        return undefined
    }
  }
}

export const getPasswordResetEmailContent = (
  name: string,
  token: string
): { subject: string; message: string } => {
  return {
    subject: 'Password Reset Request',
    message: `Dear ${name},<br /><br />
    We received a request to reset your password. If you did not make this request, you can ignore this email.<br /><br />
    To reset your password, click the following link or paste it into your browser:<br /><br />
    <a href="${CLIENT_URL}/resetpassword?token=${token}">Password Reset Link</a><br /><br />
    This link will expire in one hour. If you need to reset your password again, please submit a new request.<br /><br />
    If you have any questions, please contact our support team.<br /><br />
    `
  }
}

export const getMentorNotifyEmailContent = (
  name: string
): { subject: string; message: string } => {
  return {
    subject: 'New Mentee Application Received',
    message: `Dear ${name},<br /><br />
    We wanted to let you know that a new mentee has applied to be mentored by you through the ScholarX program. Please visit your dashboard to review their application at your earliest convenience.<br /><br />
    If you have any questions or need assistance, feel free to reach out to us at sustainableedufoundation@gmail.com.
    <br /><br />
    Thank you for your continued support and commitment to the ScholarX program.<br /><br />
    `
  }
}

export const getPasswordChangedEmailContent = (
  name: string
): { subject: string; message: string } => {
  return {
    subject: 'Password Successfully Changed',
    message: `Dear ${name},<br /><br />
    Your password has been successfully changed. If you did not make this change, please contact our support team immediately.<br /><br />
    If you have any questions, please contact our support team.<br /><br />
    `
  }
}

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}
