import { dataSource } from '../../configs/dbConfig'
import { EmailStatusTypes } from '../../enums'
import nodemailer from 'nodemailer'
import Email from '../../entities/email.entity'
import { SMTP_MAIL, SMTP_PASS } from '../../configs/envConfig'
import { loadTemplate } from '../../utils'

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
  message: string
): Promise<{
  statusCode: number
  message: string
}> => {
  const emailRepository = dataSource.getRepository(Email)

  try {
    const html = await loadTemplate('emailTemplate', {
      subject,
      message
    })

    await transporter.sendMail({
      from: `"Sustainable Education Foundation" <${SMTP_MAIL}>`,
      to,
      subject,
      html
    })

    const email = new Email(to, subject, message, EmailStatusTypes.SENT)

    await emailRepository.save(email)

    return { statusCode: 200, message: 'Email sent and saved successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Error sending email')
  }
}
