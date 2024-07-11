import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dataSource } from '../configs/dbConfig'
import { JWT_SECRET } from '../configs/envConfig'
import Profile from '../entities/profile.entity'
import { CreateProfile, type ApiResponse } from '../types'
import {
  getPasswordChangedEmailContent,
  getPasswordResetEmailContent
} from '../utils'
import { sendResetPasswordEmail } from './admin/email.service'

export const registerUser = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
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
      first_name,
      last_name,
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
  createProfileDto: CreateProfile
): Promise<Profile> => {
  const profileRepository = dataSource.getRepository(Profile)

  let user = await profileRepository.findOne({
    where: { primary_email: createProfileDto.primary_email }
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash(createProfileDto.id, 10)
    user = profileRepository.create({
      primary_email: createProfileDto.primary_email,
      password: hashedPassword,
      first_name: createProfileDto.first_name,
      last_name: createProfileDto.last_name,
      image_url: createProfileDto.image_url
    })
    await profileRepository.save(user)
  }

  return user
}

export const generateResetToken = async (
  email: string
): Promise<ApiResponse<string>> => {
  try {
    const profileRepository = dataSource.getRepository(Profile)
    const profile = await profileRepository.findOne({
      where: { primary_email: email },
      select: ['password', 'uuid']
    })

    if (!profile) {
      return {
        statusCode: 401,
        message: 'Invalid email or password'
      }
    }
    const token = jwt.sign({ userId: profile.uuid }, JWT_SECRET, {
      expiresIn: '1h'
    })
    const content = getPasswordResetEmailContent(email, token)
    if (content) {
      await sendResetPasswordEmail(email, content.subject, content.message)
    }
    return {
      statusCode: 200,
      message: 'Password reset link successfully sent to email'
    }
  } catch (error) {
    console.error(
      'Error executing Reset Password && Error sending password reset link',
      error
    )
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
): Promise<ApiResponse<string>> => {
  if (!token || !newPassword) {
    return { statusCode: 400, message: 'Missing parameters' }
  }

  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    throw new Error('Invalid token')
  }

  const profileRepository = dataSource.getRepository(Profile)
  const profile = await profileRepository.findOne({
    where: { uuid: decoded.userId }
  })

  if (!profile) {
    console.error('Error executing Reset Password: No profile found')
    return { statusCode: 409, message: 'No profile found' }
  }

  const hashedPassword = await hashPassword(newPassword)
  await saveProfile(profile, hashedPassword)
  const content = getPasswordChangedEmailContent(profile.primary_email)
  if (content) {
    await sendResetPasswordEmail(
      profile.primary_email,
      content.subject,
      content.message
    )
  }
  return { statusCode: 200, message: 'Password reset successful' }
}
