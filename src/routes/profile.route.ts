import express from 'express';
import { getProfile } from '../controllers/profile.controller';

const profileRouter = express.Router();

profileRouter.get('/me', getProfile);

export default profileRouter;
