import express from 'express';
import { createMentor } from '../services/mentor.service';
import { requireAuth } from '../controllers/auth.controller';
import { validateMentorData } from '../middleware/mentor.middleware';

const mentorRouter = express.Router();

mentorRouter.post(
  '/',
  requireAuth,
  validateMentorData,
  async (req, res) => {
    try {
      const mentorData = req.body;
      const createdMentor = await createMentor(mentorData);

      res.status(201).json({ message: 'Mentor data saved successfully', data: createdMentor });
    } catch (err) {
      console.error('Error processing mentor data', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default mentorRouter;
