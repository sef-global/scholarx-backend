import express from 'express'
import { seedDbController } from '../../controllers/seed.controller'

const seedRouter = express.Router()

seedRouter.get('/seed', seedDbController)

export default seedRouter
