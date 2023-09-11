import express from 'express'
import userRouter from './user/user.route'
import mentorRouter from './mentor/mentor.route'
import categoryRouter from './category/category.route'

const adminRouter = express()

adminRouter.use('/users', userRouter)
adminRouter.use('/mentors', mentorRouter)
adminRouter.use('/categories', categoryRouter)

export default adminRouter
