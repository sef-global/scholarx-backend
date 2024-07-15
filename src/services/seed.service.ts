import { faker } from '@faker-js/faker'
import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'
import Email from '../entities/email.entity'
import EmailTemplate from '../entities/emailTemplate.entity'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import Platform from '../entities/platform.entity'
import Profile from '../entities/profile.entity'
import { ApplicationStatus, EmailStatusTypes, ProfileTypes } from '../enums'

export const seedDatabaseService = async (): Promise<{
  statusCode: number
  message: string
}> => {
  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const profileRepository = queryRunner.manager.getRepository(Profile)
    const categoryRepository = queryRunner.manager.getRepository(Category)
    const emailRepository = queryRunner.manager.getRepository(Email)
    const emailTemplateRepository =
      queryRunner.manager.getRepository(EmailTemplate)
    const menteeRepository = queryRunner.manager.getRepository(Mentee)
    const mentorRepository = queryRunner.manager.getRepository(Mentor)
    const platformRepository = queryRunner.manager.getRepository(Platform)

    // Find and remove existing data
    await menteeRepository.remove(await menteeRepository.find())
    await mentorRepository.remove(await mentorRepository.find())
    await profileRepository.remove(await profileRepository.find())
    await platformRepository.remove(await platformRepository.find())
    await categoryRepository.remove(await categoryRepository.find())
    await emailRepository.remove(await emailRepository.find())
    await emailTemplateRepository.remove(await emailTemplateRepository.find())

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
        count: 100
      }
    )

    await emailRepository.save(genEmails)

    const genEmailTemplates = faker.helpers.multiple(
      () => {
        return {
          subject: faker.lorem.sentence(),
          content: faker.lorem.paragraph()
        }
      },
      {
        count: 100
      }
    )

    await emailTemplateRepository.save(genEmailTemplates)

    const genCategories = faker.helpers.multiple(
      () => {
        return {
          category: faker.lorem.word()
        }
      },
      {
        count: 100
      }
    )
    const categories = await categoryRepository.save(genCategories)

    const genPlatforms = faker.helpers.multiple(
      () => {
        return {
          description: faker.lorem.sentence(),
          mentor_questions: {
            name: faker.lorem.word(),
            email: faker.internet.email()
          } as unknown as JSON,
          image_url: faker.image.url(),
          landing_page_url: faker.internet.url(),
          title: faker.lorem.word()
        }
      },
      {
        count: 100
      }
    )

    await platformRepository.save(genPlatforms)

    const genMentors = (
      categories: Category[],
      profiles: Profile[]
    ): Mentor[] => {
      const firstTenProfiles = profiles.slice(0, 10)

      return firstTenProfiles.map((profile, index) => {
        const category = categories[index]
        return createMentor(category, profile)
      })
    }
    const mentorsEntities = genMentors(categories, profiles)
    const mentors = await mentorRepository.save(mentorsEntities)

    const genMentees = (mentors: Mentor[], profiles: Profile[]): Mentee[] => {
      const lastProfilesWithoutFirstTen = profiles.slice(10, profiles.length)

      return lastProfilesWithoutFirstTen.map((profile, index) => {
        const mentor =
          mentors[faker.number.int({ min: 0, max: mentors.length - 1 })]
        return new Mentee(
          faker.helpers.enumValue(ApplicationStatus),
          {
            name: faker.lorem.word(),
            email: faker.internet.email()
          },
          profile,
          mentor
        )
      })
    }

    const menteesEntities = genMentees(mentors, profiles)

    await menteeRepository.save(menteesEntities)

    await queryRunner.commitTransaction()

    return {
      statusCode: 200,
      message: 'Successfully seeded the database'
    }
  } catch (err) {
    console.log(err)
    await queryRunner.rollbackTransaction()
    return {
      statusCode: 500,
      message: 'Internal server error'
    }
  } finally {
    await queryRunner.release()
  }
}

const createRandomProfile = (): Profile => {
  const profile = {
    primary_email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    image_url: faker.image.avatar(),
    type: faker.helpers.enumValue(ProfileTypes),
    password: '12345'
  }

  return profile
}

const createMentor = (category: Category, profile: Profile): Mentor => {
  return {
    state: faker.helpers.enumValue(ApplicationStatus),
    category: category,
    application: {
      name: faker.lorem.word(),
      email: faker.internet.email()
    },
    availability: faker.datatype.boolean(),
    profile: profile
  } as unknown as Mentor
}
