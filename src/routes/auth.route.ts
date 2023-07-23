import express from 'express';
import { register, login } from '../services/auth.service';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
