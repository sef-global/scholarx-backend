import { dataSource } from '../configs/dbConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from '../configs/envConfig'
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
      contact_email: '',
      first_name: '',
      last_name: '',
      image_url: '',
      linkedin_url: ''
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
): Promise<{ statusCode: number; message: string; token?: string }> => {
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

    const token = jwt.sign({ userId: profile.uuid }, JWT_SECRET ?? '', {
      expiresIn: '10h' // To-Do: Change value in production
    })

    return { statusCode: 200, message: 'Login successful', token }
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
    where: { primary_email: profile.emails?.[0]?.value ?? '' }
  })
  if (!user) {
    const hashedPassword = await bcrypt.hash(profile.id, 10) // Use Google ID as password
    user = profileRepository.create({
      primary_email: profile.emails?.[0]?.value ?? '',
      password: hashedPassword,
      contact_email: '',
      first_name: profile.name?.givenName,
      last_name: profile.name?.familyName,
      image_url: profile.photos?.[0]?.value ?? '',
      linkedin_url: ''
    })
    await profileRepository.save(user)
  }

  return user
}

export const generateResetToken = async (
  email: string
): Promise<{ statusCode: number; message: string; token?: string }> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)
    const profile = await profileRepository.findOne({
      where: { primary_email: email },
      select: ['password', 'uuid']
    })

    if (!profile) {
      return { statusCode: 401, message: 'Invalid email or password' }
    }
    const token = jwt.sign({ userId: profile.uuid }, JWT_SECRET ?? '', {
      expiresIn: '10h'
    })
    return { statusCode: 200, message: 'Token generated', token }
  } catch (error) {
    console.error('Error executing Reset Password', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

const saveProfile = async (
  profile: Profile,
  hashedPassword: string
): Promise<void> => {
  profile.password = hashedPassword
  await dataSource.getRepository(Profile).save(profile)
}

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ statusCode: number; message: string }> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    console.log('decoded', decoded)
    const profileRepository = dataSource.getRepository(Profile)
    const profile = await profileRepository.findOne({
      where: { uuid: decoded.userId }
    })

    if (!profile) {
      return { statusCode: 401, message: 'Invalid token' }
    }

    const hashedPassword = await hashPassword(newPassword)
    await saveProfile(profile, hashedPassword)

    return { statusCode: 200, message: 'Password reset successful' }
  } catch (error) {
    console.error('Error executing Reset Password', error)
    return { statusCode: 500, message: 'Internal server error' }
  }
}
