import express from 'express'
import { getCountries } from '../../controllers/country.controller'

const countryRouter = express.Router()

countryRouter.get('/', getCountries)

export default countryRouter
