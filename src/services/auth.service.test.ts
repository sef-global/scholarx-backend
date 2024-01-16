import { registerUser, loginUser } from './auth.service'
import { dataSource } from '../configs/dbConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from '../configs/envConfig'

jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hashedPassword) =>
    Promise.resolve(password === hashedPassword)
  )
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload, secret, options) => `mocked_token_${payload.userId}`)
}))

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('registerUser', () => {
  it('should register a new user successfully', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((data) => data),
      save: jest.fn((profile) => Promise.resolve(profile))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser('newuser@example.com', 'password123')
    console.log(result.profile)
    expect(result.message).toBe('Registration successful')
  })

  it('should return conflict status code for existing user', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({})
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser('existinguser@example.com', 'password123')

    expect(result.statusCode).toBe(409)
    expect(result.message).toBe('Email already exists')
    expect(result.profile).toBeUndefined()
  })

  it('should handle internal server error during registration', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await registerUser('testuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.profile).toBeUndefined()
  })
})

describe('loginUser', () => {
  it('should return unauthorized status code for invalid email or password', async () => {
    const mockProfileRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await loginUser('nonexistentuser@example.com', 'password123')

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid email or password')
    expect(result.token).toBeUndefined()
  })

  it('should return unauthorized status code for incorrect password', async () => {
    const mockProfileRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        uuid: 'user_uuid',
        password: 'hashed_incorrect_password'
      })
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await loginUser('existinguser@example.com', 'password123')

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid email or password')
    expect(result.token).toBeUndefined()
  })

  it('should handle internal server error during login', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await loginUser('testuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.token).toBeUndefined()
  })

  it('should return unauthorized status code for invalid email or password', async () => {
    const mockError = new Error('Test repository error')
    const mockProfileRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockRejectedValue(mockError) // Simulate an error
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await loginUser('nonexistentuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.token).toBeUndefined()
  })
})
