import express from 'express'
import { getAllUsersHandler } from '../../../controllers/admin/user.controller'
import { requireAuth } from '../../../controllers/auth.controller'
import { requestQueryValidator } from '../../../middlewares/requestValidator'
import { paginationSchema } from '../../../schemas/common/pagination-request.schema'

const userRouter = express.Router()

userRouter.get(
  '/',
  [requireAuth, requestQueryValidator(paginationSchema)],
  getAllUsersHandler
)

export default userRouter
