import { dataSource } from '../../configs/dbConfig'
import {
  createEmailTemplate,
  deleteEmailTemplateById,
  getEmailTemplateById
} from './emailTemplate.service'

jest.mock('../../configs/dbConfig', () => ({
  dataSource: {
    getRepository: jest.fn()
  }
}))

describe('Email Template Service', () => {
  describe('createEmailTemplate', () => {
    it('should create an email template successfully', async () => {
      const subject = 'Test Subject'
      const content = 'Test Content'

      const mockEmailTemplateRepository = {
        save: jest.fn().mockResolvedValue({
          uuid: 'mock-uuid',
          subject,
          content,
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        } as const)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      const result = await createEmailTemplate(subject, content)

      expect(result.statusCode).toBe(201)
      expect(result.emailTemplate?.subject).toBe(subject)
      expect(result.emailTemplate?.content).toBe(content)
      expect(result.message).toBe('Email Template created successfully')
    })

    it('should handle error during email template creation', async () => {
      const subject = 'Test Subject'
      const content = 'Test Content'

      const mockEmailTemplateRepository = {
        save: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      await expect(createEmailTemplate(subject, content)).rejects.toThrowError(
        'Error creating Email Template'
      )
    })
  })

  describe('getEmailTemplateById', () => {
    it('should get an email template by ID successfully', async () => {
      const templateId = 'mock-uuid'

      const mockEmailTemplate = {
        uuid: templateId,
        subject: 'Test Subject',
        content: 'Test Content',
        created_at: new Date(),
        updated_at: new Date(),
        updateTimestamps: jest.fn(),
        generateUuid: jest.fn()
      } as const

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockResolvedValue(mockEmailTemplate)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      const result = await getEmailTemplateById(templateId)

      expect(result.statusCode).toBe(200)
      expect(result.emailTemplate?.uuid).toBe(templateId)
      expect(result.emailTemplate?.subject).toBe(mockEmailTemplate.subject)
      expect(result.emailTemplate?.content).toBe(mockEmailTemplate.content)
      expect(result.message).toBe('Email template found')
    })

    it('should handle email template not found', async () => {
      const templateId = 'nonexistent-uuid'

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      const result = await getEmailTemplateById(templateId)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Email template not found')
    })

    it('should handle error during email template retrieval', async () => {
      const templateId = 'mock-uuid'

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      await expect(getEmailTemplateById(templateId)).rejects.toThrowError(
        'Error getting email template'
      )
    })
  })

  describe('deleteEmailTemplateById', () => {
    it('should delete an email template by ID successfully', async () => {
      const templateId = 'mock-uuid'

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockResolvedValue({
          uuid: templateId,
          subject: 'Test Subject',
          content: 'Test Content',
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        }),
        remove: jest.fn().mockResolvedValue({
          uuid: templateId,
          subject: 'Test Subject',
          content: 'Test Content',
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        })
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      const result = await deleteEmailTemplateById(templateId)

      expect(result.statusCode).toBe(200)
      expect(result.message).toBe('Email template deleted successfully')
    })

    it('should handle email template not found during deletion', async () => {
      const templateId = 'nonexistent-uuid'

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockResolvedValue(null)
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      const result = await deleteEmailTemplateById(templateId)

      expect(result.statusCode).toBe(404)
      expect(result.message).toBe('Email template not found')
    })

    it('should handle error during email template deletion', async () => {
      const templateId = 'mock-uuid'

      const mockEmailTemplateRepository = {
        findOne: jest.fn().mockResolvedValue({
          uuid: templateId,
          subject: 'Test Subject',
          content: 'Test Content',
          created_at: new Date(),
          updated_at: new Date(),
          updateTimestamps: jest.fn(),
          generateUuid: jest.fn()
        }),
        remove: jest.fn().mockRejectedValue(new Error('Test repository error'))
      }

      ;(dataSource.getRepository as jest.Mock).mockReturnValueOnce(
        mockEmailTemplateRepository
      )

      await expect(deleteEmailTemplateById(templateId)).rejects.toThrowError(
        'Error deleting email template'
      )
    })
  })
})
