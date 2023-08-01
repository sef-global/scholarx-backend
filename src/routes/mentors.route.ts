import express from 'express';

const mentorRouter = express.Router();

mentorRouter.post(
  '/',
  async (req, res) => {
    try {
      const mentorData = req.body;

      res.status(201).json({ message: 'Mentor data saved successfully', data: mentorData });
    } catch (err) {
      console.error('Error processing mentor data', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default mentorRouter;
