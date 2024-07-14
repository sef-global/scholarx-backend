import { faker } from '@faker-js/faker'
import { dataSource } from '../configs/dbConfig'
import Category from '../entities/category.entity'
import Email from '../entities/email.entity'
import EmailTemplate from '../entities/emailTemplate.entity'
import Mentee from '../entities/mentee.entity'
import Mentor from '../entities/mentor.entity'
import Platform from '../entities/platform.entity'
import Profile from '../entities/profile.entity'
import { EmailStatusTypes, ProfileTypes } from '../enums'

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

    profileRepository.save(genProfiles)

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

    emailRepository.save(genEmails)

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

    emailTemplateRepository.save(genEmailTemplates)

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
    categoryRepository.save(genCategories)

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

    platformRepository.save(genPlatforms)

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

const createRandomProfile = () => {
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
