import internal from 'stream';
import { dataSource } from '../configs/dbConfig'
import Mentor from '../entities/mentor.entity';
import Profile from '../entities/profile.entity';
import { ApplicationStatus } from '../enums';
import Category from '../entities/category.entity';

export const createMentor = async (req: any) => {

  const userId = req.user.uuid;
  const userApplication = req.body;
  
  
  try {
    const profileRepository = dataSource.getRepository(Profile);
    const userProfile = await profileRepository.findOne({ where: { uuid: userId } });

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const mentorRepository = dataSource.getRepository(Mentor);
    const existingMentor = await mentorRepository.findOne({ where: { uuid: userId } });

    if (existingMentor) {
      if (existingMentor.state === ApplicationStatus.PENDING) {
        return 'Application pending';
      } else {
        const categoryRepository = dataSource.getRepository(Category);
        const category = await categoryRepository.findOne({ where: {uuid: "60b5b847-99a2-4e47-b35b-81b4284311dd"}});

        if (!category) {
          throw new Error('User profile not found');
        }

        const newMentor = new Mentor(
          ApplicationStatus.PENDING,
          category,
          userApplication,
          true,
          userProfile,
          []
        );
        await mentorRepository.save(newMentor);
        return 'Mentor added';
      }
    } else {
      const categoryRepository = dataSource.getRepository(Category);
      const category = await categoryRepository.findOne({ where: {uuid: "60b5b847-99a2-4e47-b35b-81b4284311dd"}});

      if (!category) {
        throw new Error('User profile not found');
      }

      const newMentor = new Mentor(
        ApplicationStatus.PENDING,
        category,
        userApplication,
        true,
        userProfile,
        []
      );
      await mentorRepository.save(newMentor);
      return 'Mentor added';
    }
  } catch (err) {
    console.error('Error creating mentor', err);
    throw new Error('Error creating mentor');
  }
};
