import type { Request, Response } from 'express'
import type { ApiResponse } from '../types'
import type Country from '../entities/country.entity'
import { getAllCountries } from '../services/country.service'

export const getCountries = async (
  req: Request,
  res: Response
): Promise<ApiResponse<Country[]>> => {
  try {
    const data = await getAllCountries()
    if (!data) {
      return res.status(404).json({ message: 'Countries Not Found' })
    }
    return res.status(200).json({ data, message: 'Countries Found' })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err)
      return res
        .status(500)
        .json({ error: 'Internal server error', message: err.message })
    }
    throw err
  }
}
