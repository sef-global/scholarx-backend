import { type Repository } from 'typeorm'
import MenteeReminder from '../../entities/menteeReminders.entity'
import Mentee from '../../entities/mentee.entity'
import { dataSource } from '../../configs/dbConfig'
import { MenteeApplicationStatus } from '../../enums'
import { getReminderEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export class ReminderSerivce {
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

  public async scheduleNewReminders(): Promise<void> {
    if (!this.isLastDayOfMonth()) {
      console.log('Not the last day of the month')
      return
    }

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

      for (const mentee of eligibileMentees) {
        if (!mentee.menteeid) {
          continue
        }
        const reminder = new MenteeReminder(mentee.menteeid)
        reminder.nextRetryAt = this.calculateNextReminderDate()
        console.log(reminder)
        await this.reminderRepsitory.save(reminder)
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  public async processReminders(): Promise<void> {
    if (!this.isLastDayOfMonth()) {
      console.log('Not the last day of the month')
      return
    }

    if (this.processingLock) return

    try {
      this.processingLock = true
      const pendingReminders = await this.getPendingReminders()

      console.log('Pending reminders', pendingReminders)

      for (const reminder of pendingReminders) {
        await this.processReminderWithRetry(reminder)
      }
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

      const emailContent = getReminderEmailContent(mentee.profile.first_name)
      await sendEmail(
        mentee.profile.primary_email,
        emailContent.subject,
        emailContent.message
      )

      // Update Reminder
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
    reminder.retryCount += 1
    reminder.lastErrorMessage = error.message

    if (reminder.retryCount <= this.MAX_RETRIES) {
      const backoffMinutes = Math.pow(2, reminder.retryCount) * 5
      reminder.nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000)
      await this.reminderRepsitory.save(reminder)
    }
  }

  private async getPendingReminders(): Promise<MenteeReminder[]> {
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
