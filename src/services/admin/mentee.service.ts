import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import Mentor from '../../entities/mentor.entity'
import {
  MenteeApplicationStatus,
  MentorApplicationStatus,
  type StatusUpdatedBy
} from '../../enums'
import { type PaginatedApiResponse } from '../../types'
import { getEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export const getAllMentees = async ({
  status,
  pageNumber,
  pageSize
}: {
  status: MenteeApplicationStatus | undefined
  pageNumber: number
  pageSize: number
}): Promise<PaginatedApiResponse<Mentee>> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)

    const [mentees, count] = await menteeRepository.findAndCount({
      where: status ? { state: status } : {},
      relations: ['profile', 'mentor'],
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    })

    if (mentees.length === 0) {
      return {
        statusCode: 404,
        items: [],
        totalItemCount: 0,
        pageNumber,
        pageSize,
        message: 'Mentees not found'
      }
    }

    return {
      statusCode: 200,
      items: mentees,
      totalItemCount: count,
      pageNumber,
      pageSize,
      message: 'All mentees found'
    }
  } catch (err) {
    throw new Error('Error getting mentees')
  }
}

export const getAllMenteesByMentor = async (
  status: MenteeApplicationStatus | undefined,
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
      where: {
        profile: { uuid: userId },
        state: MentorApplicationStatus.APPROVED
      },
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
  state: MenteeApplicationStatus,
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
        state: MenteeApplicationStatus.APPROVED,
        profile: {
          uuid: profileUuid
        }
      },
      relations: ['mentor']
    })

    const menteeName =
      mentee.application.firstName + ' ' + mentee.application.lastName

    const content = await getEmailContent('mentee', state, menteeName)

    if (content) {
      await sendEmail(
        mentee.application.email as string,
        content.subject,
        content.message,
        content.attachment
      )
    }
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
          status_updated_date: new Date(),
          certificate_id: content?.uniqueId
        }
      )
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

export const getAllMenteeEmailsService = async ({
  status,
  pageNumber,
  pageSize
}: {
  status: MenteeApplicationStatus | undefined
  pageNumber: number
  pageSize: number
}): Promise<PaginatedApiResponse<string>> => {
  try {
    const menteeRepositroy = dataSource.getRepository(Mentee)
    const allMentees = await menteeRepositroy.findAndCount({
      where: status ? { state: status } : {},
      relations: ['profile'],
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    })
    const emails = allMentees[0].map((mentee) => mentee?.profile?.primary_email)

    return {
      statusCode: 200,
      items: emails,
      pageNumber,
      pageSize,
      totalItemCount: allMentees[1],
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

export const revoke = async (
  userId: string
): Promise<{
  statusCode: number
  updatedMenteeApplication?: Mentee
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentee = await menteeRepository.findOne({
      where: {
        profile: { uuid: userId },
        state: MenteeApplicationStatus.PENDING
      },
      relations: ['profile', 'mentor']
    })

    if (!mentee) {
      return {
        statusCode: 404,
        message: 'Mentee not found'
      }
    }

    await menteeRepository.update(
      { uuid: mentee.uuid },
      {
        state: MenteeApplicationStatus.REVOKED,
        status_updated_date: new Date()
      }
    )

    return {
      statusCode: 200,
      message: 'Mentee application state successfully updated'
    }
  } catch (err) {
    console.error('Error updating mentee status', err)
    throw new Error('Error updating mentee status')
  }
}
