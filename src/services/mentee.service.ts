import { dataSource } from '../configs/dbConfig'
import MonthlyCheckIn from '../entities/checkin.entity'
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

    application.firstName = capitalizeFirstLetter(
      application.firstName as string
    )
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

export const addMonthlyCheckIn = async (
  menteeId: string,
  title: string,
  generalUpdatesAndFeedback: string,
  progressTowardsGoals: string,
  mediaContentLinks: string[]
): Promise<{
  statusCode: number
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const checkInRepository = dataSource.getRepository(MonthlyCheckIn)

    console.log(menteeId)

    const mentee = await menteeRepository.findOne({
      where: {
        uuid: menteeId
      }
    })

    console.log(mentee)

    if (!mentee) {
      return { statusCode: 404, message: 'Mentee not found' }
    }

    const newCheckIn = checkInRepository.create({
      title,
      generalUpdatesAndFeedback,
      progressTowardsGoals,
      mediaContentLinks,
      checkInDate: new Date(),
      mentee
    })

    console.log(newCheckIn)
    await checkInRepository.save(newCheckIn)

    return { statusCode: 200, message: 'monthly checking inserted' }
  } catch (err) {
    console.error('Error in addMonthlyCheckIn', err)
    throw new Error('Error in addMonthlyCheckIn')
  }
}

export const fetchMonthlyCheckIns = async (
  menteeId: string
): Promise<{
  statusCode: number
  checkIns: Array<{
    uuid: string
    title: string
    generalUpdatesAndFeedback: string
    progressTowardsGoals: string
    mediaContentLinks: string[]
    mentorFeedback: string | null
    isCheckedByMentor: boolean
    mentorCheckedDate: Date | null
    checkInDate: Date
    mentee: Mentee
  }>
  message: string
}> => {
  try {
    const checkInRepository = dataSource.getRepository(MonthlyCheckIn)

    const mentee = await dataSource.getRepository(Mentee).findOne({
      where: { uuid: menteeId }
    })

    if (!mentee) {
      return { statusCode: 404, checkIns: [], message: 'Mentee not found' }
    }

    const checkIns = await checkInRepository.find({
      where: { mentee: { uuid: menteeId } },
      relations: ['mentee'],
      order: { checkInDate: 'DESC' }
    })

    if (checkIns.length === 0) {
      return {
        statusCode: 404,
        checkIns: [],
        message: 'No check-ins found'
      }
    }

    const checkInsWithUuid = checkIns.map((checkIn) => ({
      uuid: checkIn.uuid,
      title: checkIn.title,
      generalUpdatesAndFeedback: checkIn.generalUpdatesAndFeedback,
      progressTowardsGoals: checkIn.progressTowardsGoals,
      mediaContentLinks: checkIn.mediaContentLinks,
      mentorFeedback: checkIn.mentorFeedback,
      isCheckedByMentor: checkIn.isCheckedByMentor,
      mentorCheckedDate: checkIn.mentorCheckedDate,
      checkInDate: checkIn.checkInDate,
      mentee: checkIn.mentee
    }))

    return {
      statusCode: 200,
      checkIns: checkInsWithUuid,
      message: 'Check-ins found'
    }
  } catch (err) {
    console.error('Error in fetchMonthlyCheckIns', err)
    return { statusCode: 500, checkIns: [], message: 'Internal server error' }
  }
}
