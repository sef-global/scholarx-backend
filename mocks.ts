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

export const platformInfo = {
  description: 'This is a sample description.',
  mentor_questions: [
    {
      question: 'What are your career goals?',
      question_type: 'text',
      options: []
    },
    {
      question: 'How do you handle challenges?',
      question_type: 'text',
      options: []
    },
    {
      question: 'Tell me about a time when you demonstrated leadership skills.',
      question_type: 'text',
      options: []
    }
  ],
  image_url: 'https://example.com/images/sample.jpg',
  landing_page_url: 'https://example.com/landing-page',
  email_templates: {
    template1: {
      subject: 'Welcome to our mentoring program!',
      body: 'Dear {{mentor_name}},\n\nWe are excited to have you join our mentoring program...'
    },
    template2: {
      subject: 'Follow-up on your mentoring session',
      body: 'Dear {{mentee_name}},\n\nI wanted to follow up on our recent mentoring session...'
    }
  },
  title: 'Sample Mentoring Program'
}

export const emailTemplateInfo = {
  subject: 'Follow-up on your mentoring session',
  content: 'Sample content'
}
