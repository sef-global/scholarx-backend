import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entity/*.js'],
  logging: true,
  synchronize: true,
});

export async function testConnection() {
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
