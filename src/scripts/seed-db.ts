import { faker } from '@faker-js/faker'
import path from 'path'
import fs from 'fs'
import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'
import Email from '../entities/email.entity'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import Profile from '../entities/profile.entity'
import Country from '../entities/country.entity'

import {
  EmailStatusTypes,
  MenteeApplicationStatus,
  MentorApplicationStatus,
  ProfileTypes
} from '../enums'

export const seedDatabaseService = async (): Promise<string> => {
  try {
    await dataSource.initialize()
    const profileRepository = dataSource.getRepository(Profile)
    const categoryRepository = dataSource.getRepository(Category)
    const emailRepository = dataSource.getRepository(Email)
    const menteeRepository = dataSource.getRepository(Mentee)
    const mentorRepository = dataSource.getRepository(Mentor)
    const countryRepository = dataSource.getRepository(Country)

    await menteeRepository.remove(await menteeRepository.find())
    await mentorRepository.remove(await mentorRepository.find())
    await profileRepository.remove(await profileRepository.find())
    await categoryRepository.remove(await categoryRepository.find())
    await emailRepository.remove(await emailRepository.find())
    await countryRepository.remove(await countryRepository.find())

    const genProfiles = faker.helpers.multiple(createRandomProfile, {
      count: 100
    })

    const profiles = await profileRepository.save(genProfiles)

    const genEmails = faker.helpers.multiple(
      () => {
        return {
          recipient: faker.internet.email(),
          subject: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          state: faker.helpers.enumValue(EmailStatusTypes)
        }
      },
      {
        count: 30
      }
    )

    await emailRepository.save(genEmails)

    const genCategories = faker.helpers.multiple(
      () => {
        return {
          category: faker.lorem.word()
        }
      },
      {
        count: 8
      }
    )
    const categories = await categoryRepository.save(genCategories)

    // Countries data file must be in the same directory as the seeding file in build directory.
    const countriesDataFilePath = path.join(__dirname, 'countries.json')
    const countriesData: Record<string, string> = JSON.parse(
      fs.readFileSync(countriesDataFilePath, 'utf-8')
    )

    for (const [code, name] of Object.entries(countriesData)) {
      const existingCountry = await countryRepository.findOne({
        where: { code }
      })

      if (!existingCountry) {
        await countryRepository.save(new Country(code, name))
      }
    }

    const genMentors = (
      categories: Category[],
      profiles: Profile[]
    ): Mentor[] => {
      return profiles.slice(0, 40).map((profile) => {
        const category =
          categories[faker.number.int({ min: 0, max: categories.length - 1 })]
        return createMentor(category, profile)
      })
    }
    const mentorsEntities = genMentors(categories, profiles)
    const mentors = await mentorRepository.save(mentorsEntities)

    const genMentees = (mentors: Mentor[], profiles: Profile[]): Mentee[] => {
      return profiles.slice(40, profiles.length).map((profile) => {
        const mentor =
          mentors[faker.number.int({ min: 0, max: mentors.length - 1 })]
        return new Mentee(
          faker.helpers.enumValue(MenteeApplicationStatus),
          {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            contactNo: faker.phone.number(),
            profilePic: faker.image.avatar(),
            cv: faker.internet.url(),
            isUndergrad: true,
            consentGiven: true,
            graduatedYear: faker.number.int({
              min: 1980,
              max: new Date().getFullYear()
            }),
            university: faker.company.name() + ' University',
            yearOfStudy: faker.number.int({ min: 1, max: 4 }),
            course: faker.person.jobType(),
            submission: faker.internet.url()
          },
          profile,
          mentor
        )
      })
    }

    const menteesEntities = genMentees(mentors, profiles)

    await menteeRepository.save(menteesEntities)

    await dataSource.destroy()
    return 'Database seeded successfully'
  } catch (err) {
    console.error(err)
    throw err
  }
}

const createRandomProfile = (): Partial<Profile> => {
  const profile = {
    primary_email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    image_url: faker.image.avatar(),
    type: ProfileTypes.DEFAULT,
    password: '12345'
  }

  return profile
}

const createMentor = (category: Category, profile: Profile): Mentor => {
  return {
    state: faker.helpers.enumValue(MentorApplicationStatus),
    category,
    application: {
      firstName: faker.person.firstName(),
      lastName: faker.person.firstName(),
      contactNo: faker.phone.number(),
      country: faker.location.country(),
      position: faker.person.jobTitle(),
      expertise: faker.lorem.words({ min: 1, max: 3 }),
      bio: faker.person.bio(),
      isPastMentor: true,
      reasonToMentor: null,
      motivation: null,
      cv: null,
      menteeExpectations: faker.lorem.paragraphs({ min: 1, max: 2 }),
      mentoringPhilosophy: faker.lorem.paragraphs({ min: 1, max: 2 }),
      noOfMentees: faker.number.int({ min: 1, max: 10 }),
      canCommit: true,
      mentoredYear: faker.number.int({
        min: 2019,
        max: new Date().getFullYear()
      }),
      category: category.uuid,
      institution: faker.company.name(),
      linkedin: faker.internet.url(),
      website: faker.internet.url(),
      email: faker.internet.email()
    },
    availability: faker.datatype.boolean(),
    profile
  } as unknown as Mentor
}

seedDatabaseService()
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
