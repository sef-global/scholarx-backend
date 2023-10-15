import { dataSource } from '../../configs/dbConfig'
import Email from '../../entities/email.entity'
import type { EmailStatusTypes } from '../../enums'

export const createEmailTemplate = async (
  recipient: string,
  subject: string,
  content: string,
  state: EmailStatusTypes
): Promise<{
  statusCode: number
  emailTemplate?: Email | null
  message: string
}> => {
  try {
    const emailRepositroy = dataSource.getRepository(Email)

    const newEmailTemplate = new Email(recipient, subject, content, state)

    const savedEmailTemplate = await emailRepositroy.save(newEmailTemplate)

    return {
      statusCode: 201,
      emailTemplate: savedEmailTemplate,
      message: 'Email Template created successfully'
    }
  } catch (err) {
    console.error('Error creating category', err)
    throw new Error('Error creating category')
  }
}
