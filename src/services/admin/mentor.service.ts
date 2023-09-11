import { dataSource } from '../../configs/dbConfig'
import Mentor from '../../entities/mentor.entity'
import type { ApplicationStatus } from '../../enums'

export const updateMentorStatus = async (
  mentorId: string,
  status: ApplicationStatus
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
