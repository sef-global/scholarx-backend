import { type Repository } from 'typeorm'
import MenteeReminder from '../../entities/menteeReminders.entity'
import Mentee from '../../entities/mentee.entity'
import { dataSource } from '../../configs/dbConfig'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { getReminderEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export class ReminderService {
  private readonly reminderRepsitory: Repository<MenteeReminder>
  private readonly menteeRepository: Repository<Mentee>
  private readonly MAX_RETRIES = 3
  private readonly BATCH_SIZE = 10
  private readonly MAX_REMINDERS = 6
  private processingLock = false

  constructor() {
    this.reminderRepsitory = dataSource.getRepository(MenteeReminder)
    this.menteeRepository = dataSource.getRepository(Mentee)
  }

  private calculateNextReminderDate(): Date {
    const today = new Date()
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    )

    lastDayOfMonth.setHours(0, 0, 0, 0)
    return lastDayOfMonth
  }

  private isLastDayOfMonth(): boolean {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return tomorrow.getDate() === 1
  }

  public async scheduleNewReminders(): Promise<{
    statusCode: number
    message: string
  }> {
    // if (!this.isLastDayOfMonth()) {
    //   console.log('Not the last day of the month')
    //   return { statusCode: 200, message: 'Not the last day of the month' }
    // }

    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()

      const eligibileMentees = await this.menteeRepository
        .createQueryBuilder('m')
        .select(['m.uuid AS menteeId'])
        .where('m.state = :state', { state: MenteeApplicationStatus.APPROVED })
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('r.menteeId')
            .from(MenteeReminder, 'r')
            .getQuery()
          return 'm.uuid NOT IN' + subQuery
        })
        .limit(this.BATCH_SIZE)
        .getRawMany()

      console.log('eligible mentees', eligibileMentees)

      if (eligibileMentees.length === 0) {
        return { statusCode: 200, message: 'No mentees to schedule' }
      }

      for (const mentee of eligibileMentees) {
        if (!mentee.menteeid) {
          continue
        }
        const reminder = new MenteeReminder(mentee.menteeid)
        console.log('Before Scheduled', reminder)
        reminder.status = ReminderStatus.SCHEDULED
        reminder.nextRetryAt = this.calculateNextReminderDate()
        console.log('After Schedules', reminder)
        await this.reminderRepsitory.save(reminder)
      }
      await queryRunner.commitTransaction()
      return { statusCode: 200, message: 'Reminders scheduled successfully' }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      return { statusCode: 500, message: 'Error scheduling reminders' }
    } finally {
      await queryRunner.release()
    }
  }

  public async processReminders(): Promise<{
    statusCode: number
    message: string
  }> {
    // if (!this.isLastDayOfMonth()) {
    //   console.log('Not the last day of the month')
    //   return { statusCode: 200, message: 'Not the last day of the month' }
    // }

    if (this.processingLock)
      return { statusCode: 429, message: 'Processing in progress' }

    try {
      this.processingLock = true
      const pendingReminders = await this.getScheduledReminders()

      console.log('Pending reminders', pendingReminders)

      if (pendingReminders.length === 0) {
        return { statusCode: 200, message: 'No reminders to process' }
      }

      for (const reminder of pendingReminders) {
        await this.processReminderWithRetry(reminder)
      }

      return { statusCode: 200, message: 'Reminders processed' }
    } catch (error) {
      return { statusCode: 500, message: 'Error processing reminders' }
    } finally {
      this.processingLock = false
    }
  }

  private async processReminderWithRetry(
    reminder: MenteeReminder
  ): Promise<void> {
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()

    console.log('Processing reminder', reminder)

    if (reminder.lastReminderSentAt?.getMonth() === new Date().getMonth()) {
      console.log('Reminder already sent this month')
      return
    }

    try {
      await queryRunner.startTransaction()

      const mentee = await this.menteeRepository
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.profile', 'p')
        .where('m.uuid = :menteeId', { menteeId: reminder.menteeId })
        .getOne()

      if (!mentee?.profile) {
        throw new Error('Mentee or Profile not found')
      }

      // Send Email

      reminder.status = ReminderStatus.SENDING

      await this.reminderRepsitory.save(reminder)

      const emailContent = getReminderEmailContent(mentee.profile.first_name)
      await sendEmail(
        mentee.profile.primary_email,
        emailContent.subject,
        emailContent.message
      )

      // Update Reminder
      reminder.status = ReminderStatus.SENT
      reminder.remindersSent += 1
      reminder.lastReminderSentAt = new Date()
      reminder.retryCount = 0
      reminder.lastErrorMessage = null

      if (reminder.remindersSent === 1) {
        reminder.firstReminderSentAt = new Date()
      }

      if (reminder.remindersSent >= this.MAX_REMINDERS) {
        reminder.isComplete = true
      } else {
        reminder.nextReminderDue = this.calculateNextReminderDate()
      }

      await queryRunner.manager.update(
        Mentee,
        { uuid: reminder.menteeId },
        { last_monthlycheck_reminder_date: new Date() }
      )

      await this.reminderRepsitory.save(reminder)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await this.handleReminderError(reminder, error as Error)
    } finally {
      await queryRunner.release()
    }
  }

  private async handleReminderError(
    reminder: MenteeReminder,
    error: Error
  ): Promise<void> {
    reminder.status = ReminderStatus.FAILED
    reminder.retryCount += 1
    reminder.lastErrorMessage = error.message

    if (reminder.retryCount <= this.MAX_RETRIES) {
      const backoffMinutes = Math.pow(2, reminder.retryCount) * 5
      reminder.nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000)
      await this.reminderRepsitory.save(reminder)
    }
  }

  private async getScheduledReminders(): Promise<MenteeReminder[]> {
    return await this.reminderRepsitory
      .createQueryBuilder('reminder')
      .where('reminder.isComplete = :isComplete', { isComplete: false })
      .andWhere('reminder.nextRetryAt >= :now', { now: new Date() })
      .andWhere('reminder.retryCount <= :maxRetries', {
        maxRetries: this.MAX_RETRIES
      })
      .orderBy('reminder.nextRetryAt', 'ASC')
      .getMany()
  }
}
