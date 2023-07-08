import app from './app';

const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;
