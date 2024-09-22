import { dataSource } from '../configs/dbConfig'
import type Country from '../entities/country.entity'
import { getAllCountries } from './country.service'

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Country Service - getAllCountries', () => {
  it('should get all countries successfully', async () => {
    const mockCountries = [
      {
        uuid: 'mock-uuid-1',
        code: 'C1',
        name: 'Country 1'
      },
      {
        uuid: 'mock-uuid-2',
        code: 'C2',
        name: 'Country 2'
      }
    ] as Country[]

    const mockCountryRepository = {
      find: jest.fn().mockResolvedValue(mockCountries)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCountryRepository
    )

    const result = await getAllCountries()
    expect(result?.length).toBe(2)
  })

  it('should handle when countries not found', async () => {
    const mockCountryRepository = {
      find: jest.fn().mockResolvedValue([])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCountryRepository
    )

    const result = await getAllCountries()
    expect(result).toBe(null)
  })
})
