const randomString = Math.random().toString(36)

export const mockMentor = {
  email: `mentor${randomString}@gmail.com`,
  password: '123'
}

export const mockAdmin = {
  email: `admin${randomString}@gmail.com`,
  password: 'admin123'
}

export const mockUser = {
  email: `user${randomString}@gmail.com`,
  password: '123'
}

export const mentorApplicationInfo = {
  application: [
    {
      question: 'What is your country?',
      answers: 'Singapore'
    },
    {
      question: 'What is your expertise?',
      answers: 'Software Engineering'
    },
    {
      question: 'What is your mentoring startegy?',
      answers: 'I will provide my insights'
    }
  ],
  categoryId: '60b5b847-99a2-4e47-b35b-81b4284311dd'
}
