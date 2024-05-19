import { dataSource } from '../configs/dbConfig'
import bcrypt from 'bcrypt'
import Profile from '../entities/profile.entity'
import type passport from 'passport'

export const registerUser = async (
  email: string,
  password: string
): Promise<{
  statusCode: number
  message: string
  profile?: Profile | null
}> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)

    const existingProfile = await profileRepository.findOne({
      where: { primary_email: email }
    })

    if (existingProfile != null) {
      return { statusCode: 409, message: 'Email already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newProfile = profileRepository.create({
      primary_email: email,
      password: hashedPassword,
      first_name: '',
      last_name: '',
      image_url: ''
    })

    await profileRepository.save(newProfile)

    const savedProfile = await profileRepository.findOne({
      where: { primary_email: email }
    })

    return {
      statusCode: 201,
      message: 'Registration successful',
      profile: savedProfile
    }
  } catch (error) {
    console.error('Error executing registration', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}

export const loginUser = async (
  email: string,
  password: string
): Promise<{ statusCode: number; message: string; user?: Profile }> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)
    const profile = await profileRepository
      .createQueryBuilder('profile')
      .addSelect('profile.password')
      .where({ primary_email: email })
      .getOne()

    if (!profile) {
      return { statusCode: 401, message: 'Invalid email or password' }
    }

    const passwordMatch = await bcrypt.compare(password, profile.password)

    if (!passwordMatch) {
      return { statusCode: 401, message: 'Invalid email or password' }
    }

    return { statusCode: 200, message: 'Login successful', user: profile }
  } catch (error) {
    console.error('Error executing login', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}

export const findOrCreateUser = async (
  profile: passport.Profile
): Promise<Profile> => {
  const profileRepository = dataSource.getRepository(Profile)
  let user = await profileRepository.findOne({
    where: { primary_email: profile.emails?.[0]?.value ?? '' },
    relations: ['mentor', 'mentee']
  })
  if (!user) {
    const hashedPassword = await bcrypt.hash(profile.id, 10) // Use Google ID as password
    user = profileRepository.create({
      primary_email: profile.emails?.[0]?.value ?? '',
      password: hashedPassword,
      first_name: profile.name?.givenName,
      last_name: profile.name?.familyName,
      image_url: profile.photos?.[0]?.value ?? ''
    })
    await profileRepository.save(user)
  }

  return user
}
