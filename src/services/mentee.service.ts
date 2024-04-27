import { dataSource } from '../configs/dbConfig'
import Mentee from '../entities/mentee.entity'
import { ApplicationStatus } from '../enums'

export const updateStatus = async (
  menteeId: string,
  state: string
): Promise<{
  statusCode: number
  updatedMenteeApplication?: Mentee
  message: string
}> => {
  try {
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentee = await menteeRepository.findOne({
      where: {
        uuid: menteeId
      }
    })

    if (!mentee) {
      return {
        statusCode: 404,
        message: 'Mentee not found'
      }
    }

    const profileUuid = mentee.profile.uuid

    const approvedApplications = await menteeRepository.findOne({
      where: {
        state: ApplicationStatus.APPROVED,
        profile: {
          uuid: profileUuid
        }
      }
    })

    // Handle Approve status
    if (approvedApplications && state === 'approved') {
      return {
        statusCode: 400,
        message: 'Mentee is already approved'
      }
    } else {
      switch (state) {
        case 'approved':
          mentee.state = ApplicationStatus.APPROVED
          break
        case 'rejected':
          mentee.state = ApplicationStatus.REJECTED
          break
        case 'pending':
          mentee.state = ApplicationStatus.PENDING
          break
        default:
          break
      }
      const updatedMenteeApplication = await menteeRepository.save(mentee)
      return {
        statusCode: 200,
        updatedMenteeApplication,
        message: 'Mentee application state successfully updated'
      }
    }
  } catch (err) {
    console.error('Error updating mentee status', err)
    throw new Error('Error updating mentee status')
  }
}
