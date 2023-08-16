import type { Request, Response } from 'express'
import { createMentor } from '../services/mentor.service'
import type Profile from '../entities/profile.entity'

export const mentorApplicationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as Profile
    const application = req.body
    const mentor = await createMentor(user, application)
    if (!mentor) {
      res.status(404).json({ message: 'Mentor not created' })
    }

    res.status(200).json(mentor)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
  }
}

// export const validateMentorData = (mentorApplication: any) => {
//   if (!Array.isArray(mentorApplication) || mentorApplication.length === 0) {
//     throw new Error('Mentors data must be an array with at least one element')
//   }

//   for (const mentor of mentorApplication) {
//     if (
//       !mentor.question ||
//       typeof mentor.question !== 'string' ||
//       !mentor.question.trim() ||
//       !mentor.answers ||
//       typeof mentor.answers !== 'string' ||
//       !mentor.answers.trim()
//     ) {
//       throw new Error('Invalid mentor data format')
//     }
//   }
//   return
// }
