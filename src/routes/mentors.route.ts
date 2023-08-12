import express from 'express';
import { requireAuth } from '../controllers/auth.controller';
import { validateMentorData } from '../middleware/mentor.middleware';
import { postMentorHandler } from '../controllers/mentor.controller';

const mentorRouter = express.Router();

mentorRouter.post('/', requireAuth, validateMentorData, postMentorHandler);

export default mentorRouter;
