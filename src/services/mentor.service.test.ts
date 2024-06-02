import { getAllMentors } from './mentor.service'
import { dataSource } from '../configs/dbConfig'
import { ProfileTypes } from '../enums'

interface Mentor {
  id: number
  name: string
}

const mentors = [
  {
    uuid: '0d22aa50-48ba-4ec0-96bd-aca9b54c7e2f',
    created_at: '2023-07-01',
    updated_at: '2023-07-10',
    state: 'approved',
    category: {
      category: 'Computer Science',
      uuid: 'fef68adb-e710-4d9e-8772-dc4905885088',
      created_at: '2023-10-29T14:20:04.335Z',
      updated_at: '2023-10-29T14:20:04.335Z'
    },
    application: {
      position: 'Software Engineer',
      country: 'United States',
      institution: 'Google',
      expertise: 'Web Development',
      menteeExpectations: 'Commitment and eagerness to learn',
      mentoringPhilosophy: 'Empowering mentees to reach their full potential',
      canCommit: true,
      isPastMentor: true,
      reasonToMentor: 'To give back to the community',
      cv: 'https://example.com/cv',
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      bio: '',
      noOfMentees: 0,
      category: ''
    },
    availability: true,
    profile: {
      created_at: new Date('2021-07-05T00:00:00.000Z'),
      updated_at: new Date('2021-07-06T00:00:00.000Z'),
      primary_email: 'mentor1@example.com',
      contact_email: 'mentor1@example.com',
      first_name: 'John',
      last_name: 'Doe',
      image_url: 'https://xsgames.co/randomusers/avatar.php?g=male',
      linkedin_url: 'https://linkedin.com/in/mentor1',
      type: ProfileTypes.DEFAULT,
      uuid: 'abc123',
      mentor: []
    }
  },
  {
    uuid: '0d22aa50-48ba-4ec0-96bd-aca9b54c7e2e',
    created_at: '2023-07-02',
    updated_at: '2023-07-12',
    state: 'approved',
    category: {
      category: 'Business',
      uuid: 'fef68adb-e710-4d9e-8772-dc4905885088',
      created_at: '2023-10-29T14:20:04.335Z',
      updated_at: '2023-10-29T14:20:04.335Z'
    },
    application: {
      position: 'Chief Marketing Officer',
      country: 'Canada',
      institution: 'Facebook',
      expertise: 'Marketing',
      menteeExpectations: 'Proactive attitude and willingness to learn',
      mentoringPhilosophy: 'Sharing practical insights for professional growth',
      canCommit: true,
      isPastMentor: false,
      reasonToMentor: 'Passion for supporting aspiring entrepreneurs',
      cv: 'https://example.com/cv',
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      bio: '',
      noOfMentees: 0,
      category: ''
    },
    availability: true,
    profile: {
      created_at: new Date('2021-07-05T00:00:00.000Z'),
      updated_at: new Date('2021-07-06T00:00:00.000Z'),
      primary_email: 'mentor2@example.com',
      contact_email: 'mentor2@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      image_url: 'https://xsgames.co/randomusers/avatar.php?g=female',
      linkedin_url: 'https://linkedin.com/in/mentor2',
      type: ProfileTypes.DEFAULT,
      uuid: 'def456',
      mentor: []
    }
  },
  {
    uuid: '0d22aa50-48ba-4ec0-96bd-aca9b54c7e2f',
    created_at: '2023-07-03',
    updated_at: '2023-07-12',
    state: 'approved',
    category: {
      category: 'Design',
      uuid: 'fef68acb-e710-4d9e-8772-dc4905885088',
      created_at: '2023-10-29T14:20:04.335Z',
      updated_at: '2023-10-29T14:20:04.335Z'
    },
    application: {
      position: 'UI/UX Designer',
      country: 'United Kingdom',
      expertise: 'UI/UX Design',
      institution: 'Facebook',
      menteeExpectations: 'Attention to detail and creativity',
      mentoringPhilosophy: 'Creating user-centric designs',
      canCommit: true,
      isPastMentor: true,
      reasonToMentor: 'To inspire and educate aspiring designers',
      cv: 'https://example.com/cv',
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      bio: '',
      noOfMentees: 0,
      category: ''
    },
    availability: true,
    profile: {
      created_at: new Date('2021-07-05T00:00:00.000Z'),
      updated_at: new Date('2021-07-06T00:00:00.000Z'),
      primary_email: 'mentor3@example.com',
      contact_email: 'mentor3@example.com',
      first_name: 'Emily',
      last_name: 'Johnson',
      image_url: '',
      linkedin_url: 'https://linkedin.com/in/mentor3',
      type: ProfileTypes.DEFAULT,
      uuid: 'ghi789',
      mentor: []
    }
  }
]

interface MockMentorRepository {
  find: jest.Mock<Promise<Mentor[]>>
}

jest.mock('../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('getAllMentors', () => {
  it('should get all mentors without category', async () => {
    const mockMentorRepository = createMockMentorRepository(mentors)
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors()

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Mentors found')
    expect(result.mentors).toEqual(mentors)
  })

  it('should get mentors with category', async () => {
    // TODO: Fix the tests
    const mockMentorRepository = createMockMentorRepository(mentors)
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors('fef68adb-e710-4d9e-8772-dc4905885088')

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('Mentors found')
    expect(result.mentors).toEqual(mentors)
  })

  it('should return an empty array if no mentors found', async () => {
    const mockMentorRepository = createMockMentorRepository([])
    ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
      mockMentorRepository
    )

    const result = await getAllMentors('SomeCategory')

    expect(result.statusCode).toBe(200)
    expect(result.message).toBe('No mentors found')
    expect(result.mentors).toStrictEqual([])
  })
})

function createMockMentorRepository(
  data: typeof mentors,
  error?: Error
): MockMentorRepository {
  return {
    find: jest.fn().mockResolvedValue(data)
  }
}
