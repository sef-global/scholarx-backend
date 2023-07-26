import express from 'express';
import passport from 'passport';
import { getProfile } from '../controllers/profile.controller';

const profileRouter = express.Router();

profileRouter.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getProfile
);

export default profileRouter;
