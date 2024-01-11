import express from 'express'
import type { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { dataSource } from './configs/dbConfig'
import authRouter from './routes/auth/auth.route'
import profileRouter from './routes/profile/profile.route'
import adminRouter from './routes/admin/admin.route'
import mentorRouter from './routes/mentor/mentor.route'
import categoryRouter from './routes/category/category.route'
import passport from 'passport'
import './configs/passport'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())
app.use(
  cors({
    origin: 'http://localhost:5173', // allow to server to accept request from different origin
    methods: 'GET, HEAD, PUT, PATCH, DELETE', // allow to perform http methods
    credentials: true // allow session cookie from browser to pass through
  })
)
app.get('/', (req, res) => {
  res.send('ScholarX Backend')
})

app.use('/api/auth', authRouter)
app.use('/api/me', profileRouter)
app.use('/api/admin', adminRouter)
app.use('/api/mentors', mentorRouter)
app.use('/api/categories', categoryRouter)

export const startServer = async (port: number): Promise<Express> => {
  try {
    await dataSource.initialize()
    console.log('DB connection is successful')
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })

    return app
  } catch (err) {
    console.log('DB connection was not successful', err)
    throw err
  }
}

export default startServer
