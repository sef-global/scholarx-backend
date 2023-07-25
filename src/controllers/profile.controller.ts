import Profile from '../entity/profile.entity';
import { dataSource } from '../configs/dbConfig';
import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profileRepository = dataSource.getRepository(Profile);

    // Find and return an array of all table rows in the profile table.
    const allProfiles = await profileRepository.find();
    res.status(200).json({ allProfiles });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: err });
  }
};
