export const createMentor = async (mentorData: any) => {
  try {
    const createdMentor = mentorData;
    return createdMentor;
  } catch (err) {
    throw new Error('Error creating mentor');
  }
};
