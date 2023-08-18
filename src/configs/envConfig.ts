import dotenv from 'dotenv'

dotenv.config()

export const DB_USER = process.env.DB_USER
export const DB_HOST = process.env.DB_HOST
export const DB_NAME = process.env.DB_NAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = process.env.DB_PORT
export const SERVER_PORT = process.env.SERVER_PORT ?? 3000
export const JWT_SECRET = process.env.JWT_SECRET ?? ''
