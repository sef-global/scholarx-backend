import { getAllMentors } from './mentor.service'
import { dataSource } from '../configs/dbConfig'

interface Mentor {
  id: number
  name: string
}

interface MockMentorRepository {
  createQueryBuilder: jest.Mock
  leftJoinAndSelect: jest.Mock
  where: jest.Mock
  andWhere: jest.Mock
  getMany: jest.Mock<Promise<Mentor[]>>
}

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('getAllMentors', () => {
  it('should get all mentors without category', async () => {
    const mockMentorRepository = createMockMentorRepository([
      { id: 1, name: 'Mentor 1' }
    ])
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors(undefined)

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Mentors found')
    expect(result.mentors).toEqual([{ id: 1, name: 'Mentor 1' }])
  })

  it('should get mentors with category', async () => {
    const mockMentorRepository = createMockMentorRepository([
      { id: 1, name: 'Mentor 1' }
    ])
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors('SomeCategory')

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Mentors found')
    expect(result.mentors).toEqual([{ id: 1, name: 'Mentor 1' }])
  })

  it('should return 404 if no mentors found', async () => {
    const mockMentorRepository = createMockMentorRepository([])
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors('SomeCategory')

    expect(result.statusCode).toBe(404)
    expect(result.message).toBe('No mentors found')
    expect(result.mentors).toBeUndefined()
  })
})

function createMockMentorRepository(
  data: Mentor[] | undefined,
  error?: Error
): MockMentorRepository {
  return {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockImplementation(async () => {
      if (error) {
        throw error
      }
      return data
    })
  }
}
