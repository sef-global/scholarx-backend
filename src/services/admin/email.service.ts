import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import type { ApplicationStatus } from '../../enums'

export const getAllMenteeEmailsService = async (
  status: ApplicationStatus | undefined
): Promise<{
  statusCode: number
  emails?: string[]
  message: string
}> => {
  try {
    const menteeRepositroy = dataSource.getRepository(Mentee)
    const allMentees: Mentee[] = await menteeRepositroy.find({
      where: status ? { state: status } : {},
      relations: ['profile']
    })
    const emails = allMentees.map((mentee) => mentee?.profile?.primary_email)
    if (!emails) {
      return {
        statusCode: 404,
        message: 'Mentees Emails not found'
      }
    }
    return {
      statusCode: 200,
      emails,
      message: 'All mentee emails with status ' + (status ?? 'undefined')
    }
  } catch (err) {
    throw new Error('Error getting mentee emails')
  }
}
