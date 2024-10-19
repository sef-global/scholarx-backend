import express from 'express'
import {
  getCountries,
  getCountryWithId
} from '../../controllers/country.controller'
import { asyncHandler } from '../../utils'

const countryRouter = express.Router()

countryRouter.get('/', asyncHandler(getCountries))
countryRouter.get('/:id', asyncHandler(getCountryWithId))

export default countryRouter
