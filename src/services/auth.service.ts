import { dataSource } from '../configs/dbConfig';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../entity/user.entity';
import { FindOneOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, contact_email, first_name, last_name, image_url, linkedin_url } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'All fields are required' });
    }

    const userRepository = dataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } } as FindOneOptions<User>);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ email, password: hashedPassword, contact_email, first_name, last_name, image_url, linkedin_url });
    await userRepository.save(newUser);

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required fields' });
    }

    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '10h', // To-Do : change value in production
    });
    res.json({ token });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
