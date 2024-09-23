import { dataSource } from '../configs/dbConfig'
import Country from '../entities/country.entity'

export const getAllCountries = async (): Promise<Country[] | null> => {
  const countryRepository = dataSource.getRepository(Country)
  const countries: Country[] = await countryRepository.find({
    select: ['uuid', 'code', 'name']
  })
  if (countries && countries.length > 0) {
    return countries
  }
  return null
}
