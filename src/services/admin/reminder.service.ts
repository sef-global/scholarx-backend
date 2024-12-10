import { type Repository } from 'typeorm'
import type Mentee from '../../entities/mentee.entity'
import { MonthlyReminder } from '../../entities/reminder.entity'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { sendEmail } from './email.service'
import { getReminderEmailContent } from '../../utils'

export class MonthlyCheckInReminderService {
  constructor(
    private readonly reminderRepository: Repository<MonthlyReminder>,
    private readonly menteeRepository: Repository<Mentee>
  ) {}

  async processReminder(): Promise<{
    statusCode: number
    message: string
  }> {
    try {
      await this.scheduleNewReminder()

      const pendingReminders = await this.reminderRepository
        .createQueryBuilder('reminder')
        .leftJoinAndSelect('reminder.mentee', 'mentee')
        .leftJoinAndSelect('mentee.profile', 'profile')
        .where('reminder.status = :status', {
          status: ReminderStatus.SCHEDULED
        })
        .andWhere('reminder.remindersSent < :maxReminders', {
          maxReminders: 6
        })
        .andWhere('reminder.nextReminderDate <= :today', {
          today: new Date()
        })
        .getMany()

      await Promise.all(
        pendingReminders.map(async (reminder) => {
          const mentee = reminder.mentee

          const emailContent = getReminderEmailContent(
            mentee.profile.first_name
          )

          await sendEmail(
            mentee.profile.primary_email,
            emailContent.subject,
            emailContent.message
          )

          reminder.remindersSent += 1
          reminder.lastSentDate = new Date()
          reminder.status =
            reminder.remindersSent > 6
              ? ReminderStatus.COMPLETED
              : ReminderStatus.SCHEDULED

          reminder.nextReminderDate = await this.calculateNextReminderDate(
            new Date()
          )

          await this.reminderRepository.save(reminder)
        })
      )

      return {
        statusCode: 200,
        message: `Processed ${pendingReminders.length} reminders`
      }
    } catch (error) {
      console.error('Error processing reminders:', {
        error,
        timestamp: new Date().toISOString()
      })
      return {
        statusCode: 500,
        message: 'Error processing reminders'
      }
    }
  }

  public async calculateNextReminderDate(currentDate: Date): Promise<Date> {
    const nextDate = new Date(currentDate)
    nextDate.setMonth(nextDate.getMonth() + 1)
    return nextDate
  }

  public async scheduleNewReminder(): Promise<void> {
    const today = new Date()

    const newMentees = await this.menteeRepository
      .createQueryBuilder('mentee')
      .leftJoinAndSelect('mentee.profile', 'profile')
      .where('mentee.state = :state', {
        state: MenteeApplicationStatus.APPROVED
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('reminder.mentee.uuid')
          .from(MonthlyReminder, 'reminder')
          .getQuery()
        return 'mentee.uuid NOT IN' + subQuery
      })
      .getMany()

    if (newMentees.length > 0) {
      const reminders = await Promise.all(
        newMentees.map(async (mentee) => {
          const reminder = new MonthlyReminder()
          reminder.mentee = mentee
          reminder.remindersSent = 0
          reminder.status = ReminderStatus.SCHEDULED
          reminder.lastSentDate = null
          reminder.nextReminderDate = await this.calculateNextReminderDate(
            today
          )
          return reminder
        })
      )

      await this.reminderRepository.save(reminders)
    }
  }
}
