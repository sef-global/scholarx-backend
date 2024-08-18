import { dataSource } from '../../configs/dbConfig'
import Profile from '../../entities/profile.entity'
import { ProfileTypes } from '../../enums'
import { getAllUsers } from './user.service'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('getAllUsers', () => {
  it('should retrieve all users successfully', async () => {
    const mockUser1 = new Profile(
      'user1@example.com',
      'contact1@example.com',
      'User1',
      'Last1',
      'image1.jpg',
      ProfileTypes.DEFAULT,
      'hashedPassword1'
    )

    const mockUser2 = new Profile(
      'user2@example.com',
      'contact2@example.com',
      'User2',
      'Last2',
      'image2.jpg',
      ProfileTypes.ADMIN,
      'hashedPassword2'
    )

    const mockProfileRepository = {
      find: jest.fn().mockResolvedValue([mockUser1, mockUser2]),
      findAndCount: jest.fn().mockResolvedValue([[mockUser1, mockUser2], 2])
    }

    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockProfileRepository
    )

    const result = await getAllUsers({
      pageNumber: 1,
      pageSize: 2
    })

    expect(result.items).toEqual([mockUser1, mockUser2])
  })
})
