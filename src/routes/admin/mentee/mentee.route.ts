import express from 'express'
import {
  getAllMenteeEmails,
  getMenteeDetails,
  getMentees,
  updateMenteeStatus
} from '../../../controllers/admin/mentee.controller'
import { requireAuth } from '../../../controllers/auth.controller'
import {
  requestBodyValidator,
  requestQueryValidator
} from '../../../middlewares/requestValidator'
import {
  getAllMenteeEmailsSchema,
  getMenteesSchema,
  updateMenteeStatusSchema
} from '../../../schemas/admin/admin.mentee-routes.schema'
import { paginationSchema } from '../../../schemas/common/pagination-request.schema'

const menteeRouter = express.Router()

menteeRouter.get(
  '/emails',
  [
    requireAuth,
    requestQueryValidator(getAllMenteeEmailsSchema.merge(paginationSchema))
  ],
  getAllMenteeEmails
)
menteeRouter.get(
  '/applications',
  [
    requireAuth,
    requestQueryValidator(getMenteesSchema.merge(paginationSchema))
  ],
  getMentees
)
menteeRouter.get('/:menteeId', requireAuth, getMenteeDetails)
menteeRouter.put(
  '/:menteeId/state',
  [requireAuth, requestBodyValidator(updateMenteeStatusSchema)],
  updateMenteeStatus
)

export default menteeRouter
