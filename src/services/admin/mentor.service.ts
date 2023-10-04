import { dataSource } from '../../configs/dbConfig'
import Mentor from '../../entities/mentor.entity'
import type { ApplicationStatus } from '../../enums'
import type { AllMentorsArray, MentorInfo } from '../../types'

const applicationFormat: MentorInfo = {
  designation: '',
  country: '',
  areas_of_expertise: '',
  expectations_from_mentees: '',
  mentoring_philosophy: '',
  commitment_to_program: false,
  previous_experience_as_mentor: false,
  reason_for_being_mentor: '',
  cv_link: ''
}

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
  status: ApplicationStatus
): Promise<{
  statusCode: number
  mentors?: AllMentorsArray[]
  message: string
}> => {
  try {
    const mentorRepository = dataSource.getRepository(Mentor)

    const mentorsList: Mentor[] = await mentorRepository.find({
      where: { state: status },
      select: [
        'application',
        'availability',
        'state',
        'created_at',
        'updated_at'
      ],
      relations: ['profile', 'category']
    })

    const mentors: AllMentorsArray[] = mentorsList.map((mentor, i) => {
      Object.entries(mentor.application).map((item) => {
        switchQuestion(item, applicationFormat)
      })
      return {
        ...mentor,
        mentor_id: i + 1,
        application: applicationFormat,
        category: mentor.category.category,
        state: mentor.state.toUpperCase()
      }
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
    console.error('Error updating the mentor status', err)
    throw new Error('Error updating the mentor status')
  }
}

function switchQuestion(item: any, format: MentorInfo): void {
  switch (item[1].question.toLowerCase()) {
    case 'what is your country?':
      format.country = item[1].answers
      break
    case 'what is your expertise?':
      format.areas_of_expertise = item[1].answers
      break
    case 'what is your mentoring startegy?':
      format.mentoring_philosophy = item[1].answers
      break
    case 'what is your designation?':
      format.designation = item[1].answers
      break
    case 'what is your reason for being mentor?':
      format.reason_for_being_mentor = item[1].answers
      break
    case 'what is your expectations from mentees?':
      format.expectations_from_mentees = item[1].answers
      break
    case 'do you have revious experience as mentor?':
      format.previous_experience_as_mentor = item[1].answers
      break
    default:
      // Handle other cases if needed
      break
  }
}
