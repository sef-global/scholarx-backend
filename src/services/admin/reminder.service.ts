import { MoreThanOrEqual, type Repository } from 'typeorm'
import type Mentee from '../../entities/mentee.entity'
import { MonthlyReminder } from '../../entities/reminder.entity'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { sendEmail } from './email.service'
import { getReminderEmailContent } from '../../utils'
import type CheckIn from '../../entities/checkin.entity'

export class MonthlyCheckInReminderService {
  constructor(
    private readonly reminderRepository: Repository<MonthlyReminder>,
    private readonly menteeRepository: Repository<Mentee>,
    private readonly checkInRepository: Repository<CheckIn>
  ) {}

  private async processIndividualReminder(
    reminder: MonthlyReminder
  ): Promise<void> {
    try {
      const mentee = reminder.mentee
      if (!mentee) {
        console.error('No mentee found for reminder')
        return
      }

      const hasSubmitted = await this.hasSubmittedMonthlyCheckIn(mentee)
      if (hasSubmitted) {
        await this.updateReminderForNextMonth(reminder)
        return
      }

      try {
        await this.sendReminderEmail(mentee)
        await this.updateReminderStatus(reminder)
      } catch (emailError) {
        console.error(
          `Error sending reminder email to ${mentee.profile.first_name}`,
          {
            error: emailError
          }
        )
      }
    } catch (error) {
      console.error(
        `Error processing reminder for mentee ${reminder.mentee?.uuid}`,
        {
          error
        }
      )
      throw error
    }
  }

  private async hasSubmittedMonthlyCheckIn(mentee: Mentee): Promise<boolean> {
    try {
      const currentDate = new Date()
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      )

      const checkIn = await this.checkInRepository.findOne({
        where: {
          mentee: { uuid: mentee.uuid },
          created_at: MoreThanOrEqual(firstDayOfMonth)
        }
      })

      return !!checkIn
    } catch (error) {
      console.error('Error checking monthly submission:', error)
      return false
    }
  }

  private async sendReminderEmail(mentee: Mentee): Promise<void> {
    const emailContent = getReminderEmailContent(mentee.profile.first_name)

    await sendEmail(
      mentee.profile.primary_email,
      emailContent.subject,
      emailContent.message
    )
  }

  private async updateReminderStatus(reminder: MonthlyReminder): Promise<void> {
    reminder.remindersSent += 1
    reminder.lastSentDate = new Date()
    reminder.status =
      reminder.remindersSent >= 6
        ? ReminderStatus.COMPLETED
        : ReminderStatus.SCHEDULED
    reminder.nextReminderDate = await this.calculateNextReminderDate(
      reminder.lastSentDate
    )
    await this.reminderRepository.save(reminder)
  }

  private async updateReminderForNextMonth(
    reminder: MonthlyReminder
  ): Promise<void> {
    reminder.nextReminderDate = await this.calculateNextReminderDate(new Date())
    await this.reminderRepository.save(reminder)
  }

  public async processReminder(): Promise<{
    statusCode: number
    message: string
  }> {
    try {
      await this.scheduleNewReminder()

      const today = new Date()
      today.setHours(0, 0, 0, 0)

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
        .andWhere('DATE(reminder.nextReminderDate) <= DATE(:today)', {
          today: today.toISOString()
        })
        .getMany()

      for (const reminder of pendingReminders) {
        await this.processIndividualReminder(reminder)
      }

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
    nextDate.setDate(25)
    nextDate.setHours(0, 0, 0, 0)
    return nextDate
  }

  private async scheduleNewReminder(): Promise<void> {
    try {
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
              new Date()
            )
            return reminder
          })
        )

        await this.reminderRepository.save(reminders)
      }
    } catch (error) {
      console.error('Error scheduling new reminders:', error)
      throw error
    }
  }
}
