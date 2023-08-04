import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { requireAuth } from '../services/auth.service';

const profileRouter = express.Router();

profileRouter.get('/profile', requireAuth, getProfile);
profileRouter.put('/profile', requireAuth, updateProfile);

export default profileRouter;
