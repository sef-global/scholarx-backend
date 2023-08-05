import { Request, Response } from 'express';
import { dataSource } from '../configs/dbConfig';
import Profile from '../entity/profile.entity';

export const getProfile = async (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: err });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const {
      primary_email,
      contact_email,
      first_name,
      last_name,
      image_url,
      linkedin_url,
    }: Profile = req.body;
    const profileRepository = dataSource.getRepository(Profile);

    const updatedProfile = await profileRepository
      .createQueryBuilder()
      .update(Profile)
      .set({
        primary_email: primary_email,
        contact_email: contact_email,
        first_name: first_name,
        last_name: last_name,
        image_url: image_url,
        linkedin_url: linkedin_url,
        updated_at: new Date().toISOString(),
      })
      .where('uuid = :uuid', { uuid: user.uuid })
      .returning([
        'uuid',
        'primary_email',
        'contact_email',
        'first_name',
        'last_name',
        'image_url',
        'linkedin_url',
        'type',
        'created_at',
        'updated_at',
      ])
      .execute();

    if (updatedProfile.raw.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(updatedProfile.raw[0]);
  } catch (err) {
    console.error('Error executing query', err);
    return res.status(500).json({ error: err });
  }
};
