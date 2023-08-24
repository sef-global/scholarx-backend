import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import { addCategory } from '../../../controllers/admin/category.controller'

const categoryRouter = express.Router()

categoryRouter.post('/', requireAuth, addCategory)

export default categoryRouter
