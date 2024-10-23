import express from 'express'
import userRouter from './user/user.route'
import mentorRouter from './mentor/mentor.route'
import categoryRouter from './category/category.route'
import menteeRouter from './mentee/mentee.route'
import reminderRouter from './remainder/remainder.route'

const adminRouter = express()

adminRouter.use('/users', userRouter)
adminRouter.use('/mentors', mentorRouter)
adminRouter.use('/mentees', menteeRouter)
adminRouter.use('/categories', categoryRouter)
adminRouter.use('/enable', reminderRouter)

export default adminRouter
