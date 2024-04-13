import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import Mentor from '../../entities/mentor.entity'
import type Profile from '../../entities/profile.entity'
import { ApplicationStatus } from '../../enums'

export const getAllMentees = async (
  status: ApplicationStatus | undefined
): Promise<{
  statusCode: number
  mentees?: Mentee[]
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)

    const mentees: Mentee[] = await menteeRepository.find({
      where: status ? { state: status } : {},
      relations: ['profile']
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

export const addMentee = async (
  user: Profile,
  application: JSON,
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

    return {
      statusCode: 200,
      mentee: newMentee,
      message: 'All mentees found'
    }
  } catch (err) {
    throw new Error('Error adding mentee')
  }
}

export const getAllMenteesByMentor = async (
  status: ApplicationStatus | undefined,
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
      where: { profile: { uuid: userId } },
      relations: ['profile']
    })

    const mentees: Mentee[] = await menteeRepository.find({
      where: status
        ? { state: status, mentor: { uuid: mentor?.uuid } }
        : { mentor: { uuid: mentor?.uuid } },
      relations: ['profile', 'mentor'],
      loadRelationIds: true
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
