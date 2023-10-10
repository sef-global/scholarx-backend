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

export interface ApiResponse<T> {
  statusCode: number
  message?: string
  data?: T | null
}
