import nodemailer from 'nodemailer'
import Email from '../entities/email.entity'
import { dataSource } from '../configs/dbConfig'
import { EmailStatusTypes } from '../enums'
import { SMTP_MAIL, SMTP_PASS } from '../configs/envConfig'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_PASS
  }
})

export const sendEmail = async (
  to: string,
  subject: string,
  content: string
): Promise<{
  statusCode: number
  message: string
}> => {
  const emailRepository = dataSource.getRepository(Email)

  try {
    // Send email
    await transporter.sendMail({
      from: '"Your Name" <your_email@example.com>', // sender address
      to,
      subject,
      text: content
    })

    // Save email to the database
    const email = new Email(to, subject, content, EmailStatusTypes.SENT)

    await emailRepository.save(email)

    return { statusCode: 200, message: 'Email sent and saved successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Error sending email')
  }
}
