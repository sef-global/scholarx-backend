// src/services/admin/reminder.service.test.ts
import { MonthlyCheckInReminderService } from './reminder.service'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { sendEmail } from './email.service'
import { getReminderEmailContent } from '../../utils'

jest.mock('./email.service')
jest.mock('../../utils')

describe('MonthlyCheckInReminderService', () => {
  let reminderService: MonthlyCheckInReminderService
  let mockReminderRepository: any
  let mockMenteeRepository: any

  beforeEach(() => {
    jest.clearAllMocks()
    ;(sendEmail as jest.Mock).mockResolvedValue(undefined)
    ;(getReminderEmailContent as jest.Mock).mockReturnValue({
      subject: 'Test Subject',
      message: 'Test Message'
    })

    mockReminderRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      save: jest.fn()
    }

    mockMenteeRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    }

    reminderService = new MonthlyCheckInReminderService(
      mockReminderRepository,
      mockMenteeRepository
    )
  })

  describe('processReminder', () => {
    it('should process new mentees and schedule reminders', async () => {
      const mockNewMentee = {
        uuid: 'mentee-1',
        profile: {
          first_name: 'John',
          primary_email: 'john@example.com'
        },
        state: MenteeApplicationStatus.APPROVED
      }

      mockMenteeRepository.getMany.mockResolvedValue([mockNewMentee])
      mockReminderRepository.getMany.mockResolvedValue([])
      mockReminderRepository.save.mockResolvedValue([])

      const result = await reminderService.processReminder()

      expect(result).toEqual({
        statusCode: 200,
        message: 'Processed 0 reminders'
      })
      expect(mockReminderRepository.save).toHaveBeenCalled()
    })

    it('should process pending reminders and send emails', async () => {
      const mockPendingReminder = {
        mentee: {
          profile: {
            first_name: 'John',
            primary_email: 'john@example.com'
          }
        },
        remindersSent: 0,
        status: ReminderStatus.SCHEDULED,
        lastSentDate: null,
        nextReminderDate: new Date()
      }

      mockMenteeRepository.getMany.mockResolvedValue([])
      mockReminderRepository.getMany.mockResolvedValue([mockPendingReminder])

      let savedReminder: any
      mockReminderRepository.save.mockImplementation(async (reminder: any) => {
        savedReminder = reminder
        return await Promise.resolve(reminder)
      })

      const result = await reminderService.processReminder()

      expect(result).toEqual({
        statusCode: 200,
        message: 'Processed 1 reminders'
      })
      expect(sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'Test Subject',
        'Test Message'
      )
      expect(savedReminder.remindersSent).toBe(1)
    })

    it('should mark reminder as completed after max reminders', async () => {
      const mockPendingReminder = {
        mentee: {
          profile: {
            first_name: 'John',
            primary_email: 'john@example.com'
          }
        },
        remindersSent: 6,
        status: ReminderStatus.SCHEDULED,
        lastSentDate: null,
        nextReminderDate: new Date()
      }

      mockMenteeRepository.getMany.mockResolvedValue([])
      mockReminderRepository.getMany.mockResolvedValue([mockPendingReminder])

      let savedReminder: any
      mockReminderRepository.save.mockImplementation(async (reminder: any) => {
        savedReminder = reminder
        return await Promise.resolve(reminder)
      })

      await reminderService.processReminder()

      expect(savedReminder.status).toBe(ReminderStatus.COMPLETED)
    })

    it('should handle errors during processing', async () => {
      mockMenteeRepository.getMany.mockRejectedValue(
        new Error('Database error')
      )

      const result = await reminderService.processReminder()

      expect(result).toEqual({
        statusCode: 500,
        message: 'Error processing reminders'
      })
    })
  })

  describe('scheduleNewReminder', () => {
    it('should create reminders for new mentees', async () => {
      const mockNewMentee = {
        uuid: 'mentee-1',
        profile: {
          first_name: 'John',
          primary_email: 'john@example.com'
        },
        state: MenteeApplicationStatus.APPROVED
      }

      mockMenteeRepository.getMany.mockResolvedValue([mockNewMentee])

      let savedReminders: any[]
      mockReminderRepository.save.mockImplementation(
        async (reminders: any[]) => {
          savedReminders = reminders
          return await Promise.resolve(reminders)
        }
      )

      await reminderService.scheduleNewReminder()

      expect(savedReminders![0]).toMatchObject({
        mentee: mockNewMentee,
        remindersSent: 0,
        status: ReminderStatus.SCHEDULED,
        lastSentDate: null
      })
    })

    it('should not create reminders when no new mentees', async () => {
      mockMenteeRepository.getMany.mockResolvedValue([])

      await reminderService.scheduleNewReminder()

      expect(mockReminderRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('calculateNextReminderDate', () => {
    it('should calculate next month correctly', async () => {
      const currentDate = new Date('2024-01-15')
      const result = await reminderService.calculateNextReminderDate(
        currentDate
      )

      expect(result.getMonth()).toBe(1) // February
      expect(result.getFullYear()).toBe(2024)
    })

    it('should handle year rollover', async () => {
      const currentDate = new Date('2024-12-15')
      const result = await reminderService.calculateNextReminderDate(
        currentDate
      )

      expect(result.getMonth()).toBe(0) // January
      expect(result.getFullYear()).toBe(2025)
    })
  })
})
