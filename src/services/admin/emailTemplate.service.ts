import { dataSource } from '../../configs/dbConfig'
import EmailTemplate from '../../entities/emailTemplate.entity'

export const createEmailTemplate = async (
  subject: string,
  content: string
): Promise<{
  statusCode: number
  emailTemplate?: EmailTemplate | null
  message: string
}> => {
  try {
    const emailTemplateRepositroy = dataSource.getRepository(EmailTemplate)

    const newEmailTemplate = new EmailTemplate(subject, content)

    const savedEmailTemplate = await emailTemplateRepositroy.save(
      newEmailTemplate
    )

    return {
      statusCode: 201,
      emailTemplate: savedEmailTemplate,
      message: 'Email Template created successfully'
    }
  } catch (err) {
    console.error('Error creating Email Template', err)
    throw new Error('Error creating Email Template')
  }
}

export const getEmailTemplateById = async (
  templateId: string
): Promise<{
  statusCode: number
  emailTemplate?: EmailTemplate | null
  message: string
}> => {
  try {
    const emailRepositroy = dataSource.getRepository(EmailTemplate)

    const emailTemplate = await emailRepositroy.findOne({
      where: { uuid: templateId },
      select: ['uuid', 'content', 'subject']
    })

    if (!emailTemplate) {
      return {
        statusCode: 404,
        message: 'Email template not found'
      }
    }

    return {
      statusCode: 200,
      emailTemplate,
      message: 'Email template found'
    }
  } catch (err) {
    console.error('Error getting email template', err)
    throw new Error('Error getting email template')
  }
}
