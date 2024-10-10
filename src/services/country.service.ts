import { AppErrorTypes, createAppError } from '../AppError'
import { dataSource } from '../configs/dbConfig'
import Country from '../entities/country.entity'

export const getAllCountries = async (): Promise<Country[]> => {
  const countryRepository = dataSource.getRepository(Country)
  const countries = await countryRepository.find({
    select: ['uuid', 'code', 'name']
  })
  if (countries && countries.length > 0) {
    return countries
  }
  throw createAppError(AppErrorTypes.NOT_FOUND_ERROR)
}

export const getCountryById = async (id: string): Promise<Country> => {
  const countryRepository = dataSource.getRepository(Country)
  const country = await countryRepository.findOneBy({
    uuid: id
  })
  if (country) {
    return country
  }
  throw createAppError(AppErrorTypes.NOT_FOUND_ERROR)
}
