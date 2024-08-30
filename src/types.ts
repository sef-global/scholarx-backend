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
