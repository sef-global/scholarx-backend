import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user contains user fetched data based on the user id from the JWT passed from the passport.ts middleware
    res.status(200).json(req.user);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: err });
  }
};
