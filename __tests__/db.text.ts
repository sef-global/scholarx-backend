import dbConfig from '../src/config/dbConfig';

describe('Test database connectivity', () => {
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
