import express from 'express'
import userRouter from './user/user.route'
import mentorRouter from './mentor/mentor.route'
import categoryRouter from './category/category.route'
import platformRouter from './platform/platform.route'
import emailTemplateRouter from './email/emailTemplate.route'
import menteeRouter from './mentee/mentee.route'

const adminRouter = express()

adminRouter.use('/users', userRouter)
adminRouter.use('/mentors', mentorRouter)
adminRouter.use('/mentee', menteeRouter)
adminRouter.use('/categories', categoryRouter)
adminRouter.use('/platform', platformRouter)
adminRouter.use('/emailTemplate', emailTemplateRouter)

export default adminRouter
