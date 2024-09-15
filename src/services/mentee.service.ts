import { dataSource } from '../configs/dbConfig'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { MenteeApplicationStatus } from '../enums'
import {
  getEmailContent,
  getMentorNotifyEmailContent,
  getMenteePublicData,
  capitalizeFirstLetter
} from '../utils'
import { sendEmail } from './admin/email.service'

export const addMentee = async (
  user: Profile,
  application: Record<string, unknown>,
  mentorId: string
): Promise<{
  statusCode: number
  mentee?: Mentee
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentor = await mentorRepository.findOne({
      where: { uuid: mentorId }
    })

    if (mentor === null || mentor === undefined) {
      return {
        statusCode: 404,
        message: 'Mentor not found'
      }
    }

    if (!mentor.availability) {
      return {
        statusCode: 403,
        message: 'Mentor is not currently available'
      }
    }

    const userMentorProfile = await mentorRepository.findOne({
      where: {
        profile: {
          uuid: user.uuid
        }
      }
    })

    if (userMentorProfile) {
      return {
        statusCode: 409,
        message:
          'A mentor cannot become a mentee, Please contact sustainableeducationfoundation@gmail.com'
      }
    }

    const existingMentees: Mentee[] = await menteeRepository.find({
      where: { profile: { uuid: user.uuid } }
    })

    for (const mentee of existingMentees) {
      switch (mentee.state) {
        case MenteeApplicationStatus.PENDING:
          return {
            statusCode: 409,
            message: 'The mentee application is pending'
          }
        case MenteeApplicationStatus.APPROVED:
          return {
            statusCode: 409,
            message: 'The user is already a mentee'
          }
        default:
          break
      }
    }

    application.firstName = capitalizeFirstLetter(application.firstName as string)
    application.lastName = capitalizeFirstLetter(application.lastName as string)
    
    const newMentee = new Mentee(
      MenteeApplicationStatus.PENDING,
      application,
      user,
      mentor
    )

    await menteeRepository.save(newMentee)

    const content = await getEmailContent(
      'mentee',
      MenteeApplicationStatus.PENDING,
      application.firstName as string
    )

    const mentorContent = getMentorNotifyEmailContent(
      mentor.application.firstName as string
    )

    if (content) {
      await sendEmail(
        application.email as string,
        content.subject,
        content.message
      )

      await sendEmail(
        mentor.application.email as string,
        mentorContent.subject,
        mentorContent.message
      )
    }

    return {
      statusCode: 200,
      mentee: newMentee,
      message: 'New mentee created'
    }
  } catch (err) {
    throw new Error('Error adding mentee')
  }
}

export const getPublicMentee = async (
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

    const publicMentee = getMenteePublicData(mentee)

    return {
      statusCode: 200,
      mentee: publicMentee,
      message: 'Mentees found'
    }
  } catch (err) {
    throw new Error('Error getting mentees')
  }
}
