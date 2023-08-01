import { dataSource } from '../configs/dbConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from '../configs/envConfig'

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
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  })(req, res, next);
};

export default requireAuth;
