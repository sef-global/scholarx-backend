import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initConnection } from './configs/dbConfig';
import userRouter from './routes/user.route';
import passport from 'passport';
import './configs/passport'

initConnection();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize()); 

app.get('/', (req, res) => {
  res.send('ScholarX Backend');
});

app.use('/api', userRouter);

export default app;
