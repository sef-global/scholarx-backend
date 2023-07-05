import { DataSource } from 'typeorm';

export const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.PORT || '3306'),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: ['src/entity/*.js'],
  logging: true,
  synchronize: true,
});

export async function testConnection() {
  myDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
      throw new Error('Data Source initialization failed');
    });
}
