import { dataSource } from '../configs/dbConfig'
import MonthlyCheckIn from '../entities/checkin.entity'
import Mentee from '../entities/mentee.entity'

export const addFeedbackByMentor = async (
  menteeId: string,
  checkInId: string,
  mentorfeedback: string,
  isCheckedByMentor: boolean
): Promise<{
  statusCode: number
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const checkInRepository = dataSource.getRepository(MonthlyCheckIn)

    const mentee = await menteeRepository.findOne({
      where: { uuid: menteeId }
    })

    if (!mentee) {
      return { statusCode: 404, message: 'Mentee not found' }
    }

    const checkIn = await checkInRepository.findOne({
      where: { uuid: checkInId, mentee: { uuid: menteeId } }
    })

    if (!checkIn) {
      return { statusCode: 404, message: 'Check-in not found' }
    }

    checkIn.mentorFeedback = mentorfeedback
    checkIn.isCheckedByMentor = isCheckedByMentor
    checkIn.mentorCheckedDate = new Date()

    await checkInRepository.save(checkIn)

    return { statusCode: 200, message: 'feedback added' }
  } catch (err) {
    console.error('Error in addFeedbackToMonthlyCheckIn', err)
    return { statusCode: 500, message: 'Internal server error' }
  }
}

export const addMonthlyCheckInByMentee = async (
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

    const mentee = await menteeRepository.findOne({
      where: {
        uuid: menteeId
      }
    })

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

    if (checkIns.length === 0 || !checkIns) {
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
