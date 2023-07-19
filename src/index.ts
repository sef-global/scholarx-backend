import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.SERVER_PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;
