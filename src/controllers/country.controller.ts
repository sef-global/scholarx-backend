import type { Request, Response } from 'express'
import type { ApiResponse } from '../types'
import type Country from '../entities/country.entity'
import { getAllCountries, getCountryById } from '../services/country.service'

export const getCountries = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Country[]>> => {
  const data = await getAllCountries()
  return res.status(200).json({ data, message: 'Countries Found' })
}

export const getCountryWithId = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Country[]>> => {
  const data = await getCountryById(req.params.id)
  return res.status(200).json({ data, message: 'Country Details' })
}
