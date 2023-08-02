import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: err });
  }
};
