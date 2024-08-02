import express from 'express'
import {
  addCategory,
  updateCategory
} from '../../../controllers/admin/category.controller'
import { requireAuth } from '../../../controllers/auth.controller'
import { requestBodyValidator } from '../../../middlewares/requestValidator'
import {
  addCategorySchema,
  updateCategorySchema
} from '../../../schemas/admin/admin.category-routes.schema'

const categoryRouter = express.Router()

categoryRouter.post(
  '/',
  [requireAuth, requestBodyValidator(addCategorySchema)],
  addCategory
)
categoryRouter.put(
  '/:categoryId',
  [requireAuth, requestBodyValidator(updateCategorySchema)],
  updateCategory
)

export default categoryRouter
