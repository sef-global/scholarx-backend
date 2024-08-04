import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'
import fs from 'fs'
import passport from 'passport'
import { dataSource } from './configs/dbConfig'
import { CLIENT_URL } from './configs/envConfig'
import './configs/google-passport'
import './configs/linkedin-passport'
import adminRouter from './routes/admin/admin.route'
import authRouter from './routes/auth/auth.route'
import categoryRouter from './routes/category/category.route'
import emailRouter from './routes/emails/emails.route'
import menteeRouter from './routes/mentee/mentee.route'
import mentorRouter from './routes/mentor/mentor.route'
import profileRouter from './routes/profile/profile.route'
import path from 'path'

const app = express()
const staticFolder = 'uploads'
export const certificatesDir = path.join(__dirname, 'certificates')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(staticFolder))
app.use(passport.initialize())
app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET, HEAD, PUT, PATCH, DELETE',
    credentials: true
  })
)

app.get('/', (req, res) => {
  res.send('ScholarX Backend')
})

app.use('/api/auth', authRouter)
app.use('/api/me', profileRouter)
app.use('/api/admin', adminRouter)
app.use('/api/mentors', mentorRouter)
app.use('/api/mentees', menteeRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/emails', emailRouter)

if (!fs.existsSync(staticFolder)) {
  fs.mkdirSync(staticFolder, { recursive: true })
  console.log('Directory created successfully!')
} else {
  console.log('Directory already exists.')
}

if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir)
}

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
