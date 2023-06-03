import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbPool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5000//process.env.PORT,
});

const checkDatabaseConnection = async () => {
  try {
    const client = await dbPool.connect();
    client.release();
    console.log('Database connected successfully!');
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

checkDatabaseConnection()
  .then((isDatabaseConnected) => {
    if (isDatabaseConnected) {
      app.get('/', (req, res) => {
        res.send('ScholarX Backend');
      });

      app.listen(3000, () => {
        console.log('Server started on PORT 3000');
      });
    } else {
      console.error('Failed to start the server: Database connection error');
    }
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });
