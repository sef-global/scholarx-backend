import app from './app';

const port = process.env.PORT || 3000;
import { testConnection } from './configs/dbConfig';

//testConnection()

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;
