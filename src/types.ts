import type Mentee from './entities/mentee.entity'

export interface ApiResponse<T> {
  statusCode: number
  message?: string
  data?: T | null
}

export interface PaginatedApiResponse<TItem> {
  pageNumber: number
  pageSize: number
  totalItemCount: number
  items: TItem[]
  statusCode: number
  message: string
}

export interface User extends Express.User {
  primary_email: string
}

export interface CreateProfile {
  primary_email: string
  id: string
  first_name: string
  last_name: string
  image_url: string
}

export interface LinkedInProfile {
  id: string
  givenName: string
  familyName: string
  picture: string
  email: string
}

export interface MonthlyCheckInResponse {
  uuid: string
  month: string
  generalUpdatesAndFeedback: string
  progressTowardsGoals: string
  mediaContentLinks: string[]
  mentorFeedback: string | null
  isCheckedByMentor: boolean
  mentorCheckedDate: Date | null
  checkInDate: Date
  mentee: Mentee
}

export interface MessageResponse {
  message: string
}
