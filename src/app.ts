import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { myDataSource } from './configs/dbConfig';

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization');
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('ScholarX Backend');
});

export default app;
