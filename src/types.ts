interface Option {
  // todo: To be determined (Not final)
  answer: string
}

interface Question {
  question: string
  answer: string
  // todo: Types should be declared here (Not final)
  type: 'TYPES'
  options: Option
}

export interface MenteeApplication {
  answers: Question[]
  state: string
  mentor_id: bigint
}

export interface MentorInfo {
  designation: string
  country: string
  areas_of_expertise: string
  expectations_from_mentees: string
  mentoring_philosophy: string
  commitment_to_program: boolean
  previous_experience_as_mentor: boolean
  reason_for_being_mentor: string
  cv_link: string
}
