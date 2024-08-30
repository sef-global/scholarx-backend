import express from 'express'
import { getCategories } from '../../controllers/category.controller'
import { requestQueryValidator } from '../../middlewares/requestValidator'
import { paginationSchema } from '../../schemas/common/pagination-request.schema'

const categoryRouter = express.Router()

categoryRouter.get('/', requestQueryValidator(paginationSchema), getCategories)

export default categoryRouter
