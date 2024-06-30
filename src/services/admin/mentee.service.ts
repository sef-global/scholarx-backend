import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import Mentor from '../../entities/mentor.entity'
import { ApplicationStatus, type StatusUpdatedBy } from '../../enums'
import { getEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export const getAllMentees = async (
  status: ApplicationStatus | undefined
): Promise<{
  statusCode: number
  mentees?: Mentee[]
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)

    const mentees: Mentee[] = await menteeRepository.find({
      where: status ? { state: status } : {},
      relations: ['profile', 'mentor']
    })

    if (!mentees) {
      return {
        statusCode: 404,
        message: 'Mentees not found'
      }
    }

    return {
      statusCode: 200,
      mentees,
      message: 'All mentees found'
    }
  } catch (err) {
    throw new Error('Error getting mentees')
  }
}

export const getAllMenteesByMentor = async (
  status: ApplicationStatus | undefined,
  userId: string
): Promise<{
  statusCode: number
  mentees?: Mentee[]
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentor: Mentor | null = await mentorRepository.findOne({
      where: { profile: { uuid: userId }, state: ApplicationStatus.APPROVED },
      relations: ['profile']
    })

    const mentees: Mentee[] = await menteeRepository.find({
      where: status
        ? { state: status, mentor: { uuid: mentor?.uuid } }
        : { mentor: { uuid: mentor?.uuid } },
      relations: ['profile', 'mentor']
    })

    if (!mentees) {
      return {
        statusCode: 404,
        message: 'Mentees not found'
      }
    }

    return {
      statusCode: 200,
      mentees,
      message: 'All mentees found'
    }
  } catch (err) {
    throw new Error('Error getting mentees')
  }
}

export const updateStatus = async (
  menteeId: string,
  state: ApplicationStatus,
  statusUpdatedBy: StatusUpdatedBy
): Promise<{
  statusCode: number
  updatedMenteeApplication?: Mentee
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentee = await menteeRepository.findOne({
      where: {
        uuid: menteeId
      },
      relations: ['profile', 'mentor']
    })

    if (!mentee) {
      return {
        statusCode: 404,
        message: 'Mentee not found'
      }
    }

    const profileUuid = mentee.profile.uuid

    const approvedApplications = await menteeRepository.findOne({
      where: {
        state: ApplicationStatus.APPROVED,
        profile: {
          uuid: profileUuid
        }
      }
    })

    // Handle Approve status
    if (approvedApplications && state === 'approved') {
      return {
        statusCode: 400,
        message: 'Mentee is already approved'
      }
    } else {
      await menteeRepository.update(
        { uuid: menteeId },
        {
          state,
          status_updated_by: statusUpdatedBy,
          status_updated_date: new Date()
        }
      )
      const content = getEmailContent(
        'mentee',
        state,
        mentee.application.firstName as string
      )

      if (content) {
        await sendEmail(
          mentee.application.email as string,
          content.subject,
          content.message
        )
      }
      return {
        statusCode: 200,
        message: 'Mentee application state successfully updated'
      }
    }
  } catch (err) {
    console.error('Error updating mentee status', err)
    throw new Error('Error updating mentee status')
  }
}

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

export const getMentee = async (
  menteeId: string
): Promise<{
  statusCode: number
  mentee: Mentee | null
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)

    const mentee = await menteeRepository.findOne({
      where: { uuid: menteeId },
      relations: ['profile', 'mentor', 'mentor.profile']
    })

    if (!mentee) {
      return {
        statusCode: 404,
        mentee: null,
        message: 'Mentee not found'
      }
    }

    return {
      statusCode: 200,
      mentee,
      message: 'Mentees found'
    }
  } catch (err) {
    throw new Error('Error getting mentees')
  }
}
