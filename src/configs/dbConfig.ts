import { DataSource } from 'typeorm'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './envConfig'
import path from 'path'

export const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT) ?? 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: ['dist/src/migrations/*.js'],
  logging: false,
  synchronize: false
})
