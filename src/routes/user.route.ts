import express from 'express';
import { register, login } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

export default userRouter;
