import type { Request, Response } from 'express'
import {
  createMentor,
  updateAvailability,
  getMentor,
  getAllMentors
} from '../services/mentor.service'
import type Profile from '../entities/profile.entity'
import type Mentor from '../entities/mentor.entity'
import type { ApiResponse } from '../types'
import type Mentee from '../entities/mentee.entity'
import { ApplicationStatus } from '../enums'
import { getAllMenteesByMentor } from '../services/admin/mentee.service'

export const mentorApplicationHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { application, categoryId } = req.body
    const { mentor, statusCode, message } = await createMentor(
      user,
      application,
      categoryId
    )

    return res.status(statusCode).json({ mentor, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const mentorAvailabilityHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const user = req.user as Profile
    const { availability } = req.body
    const result = await updateAvailability(user.uuid, availability)
    return res.status(result.statusCode).json(result.updatedMentorApplication)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const mentorDetailsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const mentorId = req.params.mentorId
    const { mentor, statusCode, message } = await getMentor(mentorId)

    if (!mentor) {
      return res.status(statusCode).json({ error: message })
    }

    const mentorDetails = {
      mentorId: mentor.uuid,
      category: mentor.category.category,
      profile: {
        contact_email: mentor.profile.contact_email,
        first_name: mentor.profile.first_name,
        last_name: mentor.profile.last_name,
        image_url: mentor.profile.image_url,
        linkedin_url: mentor.profile.linkedin_url
      }
    }
    return res.status(statusCode).json({ ...mentorDetails })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const getAllMentorsHandler = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentor>> => {
  try {
    const category: string = req.query.category as string
    const { mentors, statusCode } = await getAllMentors(category)
    if (mentors !== null && mentors !== undefined) {
      const mentorDetails = mentors.map((mentor) => ({
        mentorId: mentor.uuid,
        category: mentor.category.category,
        profile: {
          contact_email: mentor.profile.contact_email,
          first_name: mentor.profile.first_name,
          last_name: mentor.profile.last_name,
          image_url: mentor.profile.image_url,
          linkedin_url: mentor.profile.linkedin_url
        }
      }))
      return res.status(statusCode).json({ mentors: mentorDetails })
    } else {
      return res.status(200).json({ mentors: [] })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}

export const getMenteesByMentor = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Mentee[]>> => {
  try {
    const user = req.user as Profile
    const status: ApplicationStatus | undefined = req.query.status as
      | ApplicationStatus
      | undefined

    if (status && !(status.toUpperCase() in ApplicationStatus)) {
      return res.status(400).json({ message: 'Please provide a valid status' })
    }

    const { mentees, statusCode, message } = await getAllMenteesByMentor(
      status,
      user.uuid
    )
    return res.status(statusCode).json({ mentees, message })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }

    throw err
  }
}
