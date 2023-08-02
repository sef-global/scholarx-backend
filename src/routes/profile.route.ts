import express from 'express';
import { getProfile } from '../controllers/profile.controller';
import { requireAuth } from '../services/auth.service';

const profileRouter = express.Router();

profileRouter.get('/profile', requireAuth, getProfile);

export default profileRouter;
