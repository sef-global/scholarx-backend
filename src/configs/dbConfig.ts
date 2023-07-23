import { DataSource } from 'typeorm';
import { DB_PASSWORD, DB_HOST, DB_PORT, DB_USER, DB_NAME } from './envConfig';
export const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['src/entity/*.ts'],
  logging: true,
  synchronize: false,
});

export async function initConnection() {
  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
      throw new Error('Data Source initialization failed');
    });
}
