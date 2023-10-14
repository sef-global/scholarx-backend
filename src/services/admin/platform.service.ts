import Platform from '../../entities/platform.entity'
import { dataSource } from '../../configs/dbConfig'

export const createPlatform = async ({
  description,
  mentor_questions,
  image_url,
  landing_page_url,
  email_templates,
  title
}: Platform): Promise<{
  statusCode: number
  platform?: Platform | null
  message: string
}> => {
  try {
    const platformRepository = dataSource.getRepository(Platform)

    const newPlatform = new Platform(
      description,
      mentor_questions,
      image_url,
      landing_page_url,
      email_templates,
      title
    )

    const savedPlatform = await platformRepository.save(newPlatform)

    return {
      statusCode: 201,
      platform: savedPlatform,
      message: 'Platform created successfully '
    }
  } catch (err) {
    console.error('Error creating Platform', err)
    throw new Error('Error creating Platform')
  }
}
