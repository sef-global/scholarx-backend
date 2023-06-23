import { Pool, PoolClient } from 'pg';

export const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port:5432// process.env.PORT || 5432,
});

export async function testConnection() {
  if (!process.env.USER || !process.env.HOST || !process.env.DATABASE || !process.env.PASSWORD || !process.env.PORT) {
    throw new Error('Missing database configuration');
  }

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}
