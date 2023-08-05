import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { dataSource } from './configs/dbConfig'
import authRouter from './routes/auth.route'
import profileRouter from './routes/profile.route'
import passport from 'passport'
import './configs/passport'
import { SERVER_PORT } from './configs/envConfig'

const port = SERVER_PORT

dataSource
  .initialize()
  .then(() => {
    console.log('d')
  })
  .catch(() => {
    console.log('d')
  })

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())

app.get('/', (req, res) => {
  res.send('ScholarX Backend')
})

app.use('/api/auth', authRouter)
app.use('/api/me', profileRouter)

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default server
