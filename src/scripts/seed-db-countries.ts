import path from 'path'
import fs from 'fs'
import { dataSource } from '../configs/dbConfig'
import { Country } from '../entities/country.entity'

// Countries file must be in the same directory as the seeding file in build directory.
const countriesDataFileName = 'countries.json'
const countriesFilePath = path.join(__dirname, countriesDataFileName)

export const seedCountries = async (): Promise<void> => {
  const countriesData: Record<string, string> = JSON.parse(
    fs.readFileSync(countriesFilePath, 'utf-8')
  )

  await dataSource.initialize()
  const countryRepository = dataSource.getRepository(Country)

  for (const [code, name] of Object.entries(countriesData)) {
    const existingCountry = await countryRepository.findOne({
      where: { code }
    })

    if (!existingCountry) {
      await countryRepository.save(new Country(code, name))
      console.log(`Inserted: ${name}`)
    } else {
      console.log(`Country already exists: ${name}`)
    }
  }
  await dataSource.destroy()
}

seedCountries()
  .then(() => {
    console.log('Countries Seeding completed')
  })
  .catch((err) => {
    console.error('Countries Seeding Error', err)
  })
