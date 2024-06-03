import { getAllCategories } from './category.service'
import { dataSource } from '../configs/dbConfig'
import type Category from '../entities/category.entity'

import {
  registerUser,
  loginUser,
  resetPassword,
  generateResetToken
} from './auth.service'

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Category Service - getAllCategories', () => {
  it('should get all categories successfully', async () => {
    const mockCategories = [
      {
        uuid: 'mock-uuid-1',
        category: 'Category 1'
      },
      {
        uuid: 'mock-uuid-2',
        category: 'Category 2'
      }
    ] as Category[]

    const mockCategoryRepository = {
      find: jest.fn().mockResolvedValue(mockCategories)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCategoryRepository
    )

    const result = await getAllCategories()

    expect(result.statusCode).toBe(200)
    expect(result.categories?.length).toBe(2)
    expect(result.categories).toEqual([
      { uuid: 'mock-uuid-1', category: 'Category 1' },
      { uuid: 'mock-uuid-2', category: 'Category 2' }
    ])
    expect(result.message).toBe('All Categories found')
  })

  it('should handle categories not found', async () => {
    const mockCategoryRepository = {
      find: jest.fn().mockResolvedValue([])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockCategoryRepository
    )

    const result = await getAllCategories()

    expect(result.categories?.length).toBe(0)
  })
})

jest.mock('bcrypt', () => ({
  hash: jest.fn(
    async (password: string) => await Promise.resolve(`hashed_${password}`)
  ),
  compare: jest.fn(
    async (password, hashedPassword) =>
      await Promise.resolve(password === hashedPassword)
  )
}))

interface PayloadType {
  userId: string
}

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload: PayloadType) => `mocked_token_${payload.userId}`)
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
      save: jest.fn(async (profile) => await Promise.resolve(profile))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser(
      'newuser@example.com',
      'password123',
      'John',
      'Doe'
    )
    expect(result.message).toBe('Registration successful')
  })

  it('should return conflict status code for an existing user', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({})
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser(
      'existinguser@example.com',
      'password123',
      'John',
      'Doe'
    )

    expect(result.statusCode).toBe(409)
    expect(result.message).toBe('Email already exists')
    expect(result.profile).toBeUndefined()
  })

  it('should handle internal server error during registration', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await registerUser(
      'testuser@example.com',
      'password123',
      'John',
      'Doe'
    )

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.profile).toBeUndefined()
  })
})

describe('loginUser', () => {
  it('should return unauthorized status code for an invalid email or password', async () => {
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
    expect(result.user).toBeUndefined()
  })

  it('should return unauthorized status code for an incorrect password', async () => {
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
    expect(result.user).toBeUndefined()
  })

  it('should handle an internal server error during login', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await loginUser('testuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.user).toBeUndefined()
  })

  it('should return unauthorized status code for an invalid email or password', async () => {
    const mockError = new Error('Test repository error')
    const mockProfileRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockRejectedValue(mockError)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await loginUser('nonexistentuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.user).toBeUndefined()
  })
})

describe('Auth Service', () => {
  let token: any
  const validEmail = 's22010178@ousl.lk'
  const invalidEmail = 'invalid@ousl.lk'
  const newPassword = 'newpassword123'

  beforeAll(async () => {
    token = await generateResetToken(validEmail)
    console.log(token)
  })

  it('should generate a password reset token', async () => {
    expect(token).toBeDefined()
  })

  it('should not generate a password reset token for invalid email', async () => {
    const result = await generateResetToken(invalidEmail)

    expect(result.statusCode).toBe(500)
  })

  it('should reset a user password successfully', async () => {
    const t = await generateResetToken(validEmail)

    if (!t.token) {
      throw new Error('Token not generated')
    }

    const token: string = t.token
    console.log(token)

    const result = await resetPassword(token, newPassword)

    expect(result.statusCode).toBe(200)
  })

  it('should return error when parameters are missing', async () => {
    const result = await resetPassword('', newPassword)

    expect(result.statusCode).toBe(400)
    expect(result.message).toBe('Missing parameters')
  })

  it('should return error when token is invalid', async () => {
    const result = await resetPassword('invalidtoken', newPassword)

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid token')
  })
})

jest.mock('bcrypt', () => ({
  hash: jest.fn(
    async (password: string) => await Promise.resolve(`hashed_${password}`)
  ),
  compare: jest.fn(
    async (password, hashedPassword) =>
      await Promise.resolve(password === hashedPassword)
  )
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(
    (payload: { userId: string }) => `mocked_token_${payload.userId}`
  ),
  verify: jest.fn((token: string) => {
    if (token === 'valid_token') {
      return { userId: 'user_id' }
    } else {
      throw new Error('Invalid token')
    }
  })
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
      save: jest.fn(async (profile) => await Promise.resolve(profile))
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser(
      'newuser@example.com',
      'password123',
      'John',
      'Doe'
    )
    expect(result.statusCode).toBe(201)
    expect(result.message).toBe('Registration successful')
    expect(result.profile).toBeDefined()
  })

  it('should return conflict status code for an existing user', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({})
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await registerUser(
      'existinguser@example.com',
      'password123',
      'John',
      'Doe'
    )

    expect(result.statusCode).toBe(409)
    expect(result.message).toBe('Email already exists')
    expect(result.profile).toBeUndefined()
  })

  it('should handle internal server error during registration', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await registerUser(
      'testuser@example.com',
      'password123',
      'John',
      'Doe'
    )

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.profile).toBeUndefined()
  })
})

describe('loginUser', () => {
  it('should return unauthorized status code for an invalid email or password', async () => {
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
    expect(result.user).toBeUndefined()
  })

  it('should return unauthorized status code for an incorrect password', async () => {
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
    expect(result.user).toBeUndefined()
  })

  it('should handle an internal server error during login', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await loginUser('testuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.user).toBeUndefined()
  })

  it('should handle an internal server error during login', async () => {
    const mockError = new Error('Test repository error')
    const mockProfileRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockRejectedValue(mockError)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await loginUser('nonexistentuser@example.com', 'password123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.user).toBeUndefined()
  })
})

describe('generateResetToken', () => {
  it('should generate a password reset token', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({
        uuid: 'user_id'
      })
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await generateResetToken('testuser@example.com')

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Token generated')
    expect(result.token).toBeDefined()
  })

  it('should return error for invalid email', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue(null)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await generateResetToken('nonexistentuser@example.com')

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid email or password')
    expect(result.token).toBe('')
  })

  it('should handle internal server error during token generation', async () => {
    ;(dataSource.getRepository as jest.Mock).mockImplementation(() => {
      throw new Error('Test repository error')
    })

    const result = await generateResetToken('testuser@example.com')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Internal server error')
    expect(result.token).toBe('')
  })
})

describe('resetPassword', () => {
  it('should reset a user password successfully', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({
        uuid: 'user_id'
      })
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await resetPassword('valid_token', 'newpassword123')

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Password reset successful')
  })

  it('should return error when parameters are missing', async () => {
    const result = await resetPassword('', 'newpassword123')

    expect(result.statusCode).toBe(400)
    expect(result.message).toBe('Missing parameters')
  })

  it('should return error when token is invalid', async () => {
    const result = await resetPassword('invalid_token', 'newpassword123')

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Invalid token')
  })

  it('should return error when profile is not found', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue(null)
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await resetPassword('valid_token', 'newpassword123')

    expect(result.statusCode).toBe(404)
    expect(result.message).toBe('No profile found')
  })

  it('should handle internal server error during password reset', async () => {
    const mockProfileRepository = {
      findOne: jest.fn().mockResolvedValue({
        uuid: 'user_id'
      })
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    jest.mock('bcrypt', () => ({
      hash: jest.fn().mockRejectedValue(new Error('Test bcrypt error'))
    }))

    const result = await resetPassword('valid_token', 'newpassword123')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Error updating profile')
  })
})
