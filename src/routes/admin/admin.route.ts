import express from 'express'
import userRouter from './user/user.route'
import mentorRouter from './mentor/mentor.route'
import categoryRouter from './category/category.route'
import platformRouter from './platform/platform.route'
import emailRouter from './email/email.route'

const adminRouter = express()

adminRouter.use('/users', userRouter)
adminRouter.use('/mentors', mentorRouter)
adminRouter.use('/categories', categoryRouter)
adminRouter.use('/platform', platformRouter)
adminRouter.use('/emails', emailRouter)

export default adminRouter
