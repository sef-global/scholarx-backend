import { dataSource } from '../configs/dbConfig'
import MonthlyCheckIn from '../entities/checkin.entity'
import Mentee from '../entities/mentee.entity'
import { type MonthlyCheckInResponse } from '../types'

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
  month: string,
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
      month,
      generalUpdatesAndFeedback,
      progressTowardsGoals,
      mediaContentLinks: mediaContentLinks || null,
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
  checkIns: MonthlyCheckInResponse[]
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

    return {
      statusCode: 200,
      checkIns,
      message: 'Check-ins found'
    }
  } catch (err) {
    console.error('Error in fetchMonthlyCheckIns', err)
    return { statusCode: 500, checkIns: [], message: 'Internal server error' }
  }
}
