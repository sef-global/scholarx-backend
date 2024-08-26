import { dataSource } from '../../configs/dbConfig'
import Mentor from '../../entities/mentor.entity'
import type { MentorApplicationStatus } from '../../enums'
import { type PaginatedApiResponse } from '../../types'
import { getEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export const updateMentorStatus = async (
  mentorId: string,
  status: MentorApplicationStatus
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentor = await mentorRepository.findOne({
      where: { uuid: mentorId }
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    await mentorRepository.update({ uuid: mentorId }, { state: status })

    const content = await getEmailContent(
      'mentor',
      status,
      mentor.application.firstName as string
    )

    if (content) {
      await sendEmail(
        mentor.application.email as string,
        content.subject,
        content.message
      )
    }

    return {
      statusCode: 200,
      mentor,
      message: 'Updated Mentor application status successfully'
    }
  } catch (err) {
    console.error('Error updating the mentor status', err)
    throw new Error('Error updating the mentor status')
  }
}

export const getAllMentors = async ({
  status,
  pageNumber,
  pageSize
}: {
  status: MentorApplicationStatus | undefined
  pageNumber: number
  pageSize: number
}): Promise<PaginatedApiResponse<Mentor>> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const [mentors, count] = await mentorRepository.findAndCount({
      where: status ? { state: status } : {},
      relations: ['profile', 'category'],
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    })

    if (mentors.length === 0) {
      return {
        statusCode: 404,
        pageNumber,
        pageSize,
        items: [],
        totalItemCount: 0,
        message: 'Mentors not found'
      }
    }

    return {
      statusCode: 200,
      pageNumber,
      pageSize,
      items: mentors,
      totalItemCount: count,
      message: 'All Mentors found'
    }
  } catch (err) {
    throw new Error('Error getting mentors')
  }
}

export const findAllMentorEmails = async (
  status: MentorApplicationStatus | undefined
): Promise<{
  statusCode: number
  emails?: string[]
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const allMentors: Mentor[] = await mentorRepository.find({
      where: status ? { state: status } : {},
      relations: ['profile']
    })

    const emails = allMentors.map((mentor) => mentor?.profile?.primary_email)

    if (!emails) {
      return {
        statusCode: 404,
        message: 'Mentors Emails not found'
      }
    }

    return {
      statusCode: 200,
      emails,
      message: 'All Mentors Emails found'
    }
  } catch (err) {
    throw new Error('Error getting mentors emails')
  }
}

export const getMentor = async (
  mentorId: string
): Promise<{
  statusCode: number
  mentor?: Mentor | null
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentor = await mentorRepository.findOne({
      where: { uuid: mentorId },
      relations: ['profile', 'category']
    })

    if (!mentor) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    return {
      statusCode: 200,
      mentor,
      message: 'Mentor application found'
    }
  } catch (err) {
    console.error('Error updating the mentor status', err)
    throw new Error('Error updating the mentor status')
  }
}
