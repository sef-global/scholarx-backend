import { dataSource } from '../configs/dbConfig'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import type Profile from '../entities/profile.entity'
import { ApplicationStatus } from '../enums'
import { getEmailContent, getMentorNotifyEmailContent } from '../utils'
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
        case ApplicationStatus.PENDING:
          return {
            statusCode: 409,
            message: 'The mentee application is pending'
          }
        case ApplicationStatus.APPROVED:
          return {
            statusCode: 409,
            message: 'The user is already a mentee'
          }
        default:
          break
      }
    }

    const newMentee = new Mentee(
      ApplicationStatus.PENDING,
      application,
      user,
      mentor
    )

    await menteeRepository.save(newMentee)

    const content = await getEmailContent(
      'mentee',
      ApplicationStatus.PENDING,
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
