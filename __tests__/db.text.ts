import request from 'supertest';
import app from '../src/index';
import dbConfig from '../src/config/dbConfig';

describe('Test database connectivity', () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(3001, () => {
      console.log('Testing server Started on PORT 3001');
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Testing server Closed');
      done();
    });
  });

  it('Should establish a successful database connection', async () => {
    const { user, host, database, password, port } = dbConfig;
    const { Pool } = require('pg');
    const pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });

    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful');
      expect(true).toBe(true);
    } catch (error) {
      console.log('Database connection failed:', error);
      throw new Error('Database connection failed');
    }
  });
});
