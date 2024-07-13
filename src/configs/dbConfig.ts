import { DataSource } from 'typeorm'
import { DB_PASSWORD, DB_HOST, DB_PORT, DB_USER, DB_NAME } from './envConfig'

export const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT) ?? 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['src/entities/*.ts'],
  logging: false,
  synchronize: true,
  ssl: true
})
