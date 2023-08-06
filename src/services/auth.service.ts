import { dataSource } from '../configs/dbConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from '../configs/envConfig'

export const registerUser = async (
  email: string,
  password: string
): Promise<Profile> => {
  const profileRepository = dataSource.getRepository(Profile)

  const existingProfile = await profileRepository.findOne({
    where: { primary_email: email }
  })
  if (existingProfile != null) {
    throw new Error('Email already exists')
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

  return newProfile
}

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  const profileRepository = dataSource.getRepository(Profile)
  const profile = await profileRepository
    .createQueryBuilder('profile')
    .addSelect('profile.password')
    .where({ primary_email: email })
    .getOne()

  if (!profile) {
    throw new Error('Invalid email or password')
  }

  const passwordMatch = await bcrypt.compare(password, profile.password)

  if (!passwordMatch) {
    throw new Error('Invalid email or password')
  }

  const token = jwt.sign({ userId: profile.uuid }, JWT_SECRET ?? '', {
    expiresIn: '10h' // To-Do: Change value in production
  })

  return { token }
}
