import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import { ApplicationStatus } from '../../enums'

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
    const mentee = await menteeRepository.find({
      where: {
        uuid: menteeId
      }
    })

    const profileUuid = mentee[0].profile.uuid

    const approvedApplications = await menteeRepository.find({
      where: {
        state: ApplicationStatus.APPROVED,
        profile: {
          uuid: profileUuid
        }
      }
    })

    // Handle Approve status
    if (approvedApplications && state === 'approved') {
      //   reject current approved applications
      approvedApplications[0].state = ApplicationStatus.REJECTED
      await menteeRepository.save(approvedApplications[0])
      //   approve the application
      mentee[0].state = ApplicationStatus.APPROVED
      const updatedMenteeApplication = await menteeRepository.save(mentee[0])
      return {
        statusCode: 200,
        updatedMenteeApplication,
        message: 'Mentee application state successfully updated'
      }
    } else {
      switch (state) {
        case 'approved':
          mentee[0].state = ApplicationStatus.APPROVED
          break
        case 'rejected':
          mentee[0].state = ApplicationStatus.REJECTED
          break
        case 'pending':
          mentee[0].state = ApplicationStatus.PENDING
          break
        default:
          break
      }
      const updatedMenteeApplication = await menteeRepository.save(mentee[0])
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
