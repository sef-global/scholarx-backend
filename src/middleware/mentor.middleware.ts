import { Request, Response, NextFunction } from 'express';

export const validateMentorData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mentorData = req.body;

  if (!Array.isArray(mentorData) || mentorData.length === 0) {
    return res.status(400).json({
      error: 'Mentors data must be an array with at least one element',
    });
  }

  for (const mentor of mentorData) {
    if (
      !mentor.question ||
      typeof mentor.question !== 'string' ||
      !mentor.question.trim() ||
      !mentor.answers ||
      typeof mentor.answers !== 'string' ||
      !mentor.answers.trim()
    ) {
      return res.status(400).json({ error: 'Invalid mentor data format' });
    }
  }
  next();
};
