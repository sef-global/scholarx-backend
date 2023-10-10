import express from 'express'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  addCategory,
  updateCategory
} from '../../../controllers/admin/category.controller'

const categoryRouter = express.Router()

categoryRouter.post('/', requireAuth, addCategory)
categoryRouter.put('/:categoryId', requireAuth, updateCategory)

export default categoryRouter
