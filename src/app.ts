import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initConnection } from './configs/dbConfig';

initConnection();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('ScholarX Backend');
});

export default app;
