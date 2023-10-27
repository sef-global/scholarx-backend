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

export const getPlatformDetails = async (): Promise<{
  statusCode: number
  platform?: Platform[] | null
  message: string
}> => {
  try {
    const platformRepository = dataSource.getRepository(Platform)

    const platform = await platformRepository.find()

    return {
      statusCode: 200,
      platform,
      message: 'Get Platform details successfully'
    }
  } catch (err) {
    console.error('Error creating Platform', err)
    throw new Error('Error creating Platform')
  }
}

export const updatePlatformDetails = async ({
  uuid,
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

    const updateData = {
      description,
      mentor_questions,
      image_url,
      landing_page_url,
      email_templates,
      title
    }

    const result = await platformRepository.update({ uuid }, updateData)

    if (result.affected === 0) {
      return {
        statusCode: 404,
        message: 'Platform not found'
      }
    }

    const updatedPlatform = await platformRepository.findOne({
      where: { uuid }
    })

    return {
      statusCode: 200,
      platform: updatedPlatform,
      message: 'Platform updated successfully'
    }
  } catch (err) {
    console.error('Error updateing platform', err)
    throw new Error('Error updating platform')
  }
}
