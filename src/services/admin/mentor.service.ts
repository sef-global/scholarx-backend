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

export const getAllMentors = async (
  status: ApplicationStatus | undefined
): Promise<{
  statusCode: number
  mentors?: Mentor[]
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentors: Mentor[] = await mentorRepository.find({
      where: status ? { state: status } : {},
      select: [
        'application',
        'availability',
        'state',
        'created_at',
        'updated_at'
      ],
      relations: ['profile', 'category']
    })

    if (!mentors) {
      return {
        statusCode: 404,
        message: 'Mentors not found'
      }
    }

    return {
      statusCode: 200,
      mentors,
      message: 'All Mentors found'
    }
  } catch (err) {
    throw new Error('Error getting mentors')
  }
}
