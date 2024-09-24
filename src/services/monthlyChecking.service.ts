import { dataSource } from '../configs/dbConfig'
import MonthlyCheckIn from '../entities/checkin.entity'
import Mentee from '../entities/mentee.entity'

export const addMentorFeedbackMonthlyCheckIn = async (
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
    console.log(menteeId)

    if (!mentee) {
      return { statusCode: 404, message: 'Mentee not found' }
    }
    console.log(mentee)

    const checkIn = await checkInRepository.findOne({
      where: { uuid: checkInId, mentee: { uuid: menteeId } }
    })

    if (!checkIn) {
      return { statusCode: 404, message: 'Check-in not found' }
    }

    console.log(checkIn)

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
