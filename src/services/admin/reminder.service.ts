import { type Repository } from 'typeorm'
import { MonthlyReminder } from '../../entities/monthlyReminders.entity'
import type Mentee from '../../entities/mentee.entity'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { getReminderEmailContent } from '../../utils'
import { sendEmail } from './email.service'

export class MonthlyReminderService {
  constructor(
    private readonly reminderRepo: Repository<MonthlyReminder>,
    private readonly menteeRepo: Repository<Mentee>
  ) {}

  async processReminders(): Promise<{
    statusCode: number
    message: string
  }> {
    // Schedule new reminders
    try {
      await this.scheduleNewReminder()

      const pendingReminders = await this.reminderRepo
        .createQueryBuilder('reminder')
        .leftJoinAndSelect('reminder.mentee', 'mentee')
        .leftJoinAndSelect('mentee.profile', 'profile')
        .where('reminder.remindersSent <= :maxReminders', { maxReminders: 6 })
        .andWhere('reminder.status != :status', {
          status: ReminderStatus.COMPLETED
        })
        .andWhere(
          "(reminder.lastSentDate IS NULL OR DATE_PART('month', reminder.lastSentDate) != DATE_PART('month', CURRENT_DATE))"
        )
        .getMany()

      if (pendingReminders.length === 0) {
        return {
          statusCode: 200,
          message: 'No reminders to process'
        }
      }

      for (const reminder of pendingReminders) {
        try {
          reminder.status = ReminderStatus.SENDING
          await this.reminderRepo.save(reminder)

          // Send email
          const emailContent = getReminderEmailContent(
            reminder.mentee.profile.first_name
          )
          await sendEmail(
            reminder.mentee.profile.primary_email,
            emailContent.subject,
            emailContent.message
          )

          // Update reminder status
          reminder.remindersSent += 1
          reminder.lastSentDate = new Date()
          reminder.status =
            reminder.remindersSent >= 6
              ? ReminderStatus.COMPLETED
              : ReminderStatus.SCHEDULED

          await this.reminderRepo.save(reminder)
        } catch (error) {
          reminder.status = ReminderStatus.FAILED
          await this.reminderRepo.save(reminder)
          console.error(
            `Failed to process reminder for mentee ${reminder.mentee.uuid}:`,
            error
          )
        }
      }

      return {
        statusCode: 200,
        message: `Processed ${pendingReminders.length} reminders`
      }
    } catch (error) {
      console.error('Error processing reminders:', error)
      return {
        statusCode: 500,
        message: 'Failed to process reminders'
      }
    }
  }

  private async scheduleNewReminder(): Promise<void> {
    const newMentees = await this.menteeRepo
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
        return 'mentee.uuid NOT IN ' + subQuery
      })
      .getMany()

    if (newMentees.length > 0) {
      const reminders = newMentees.map((mentee) =>
        this.reminderRepo.create({
          mentee,
          remindersSent: 0,
          status: ReminderStatus.SCHEDULED,
          lastSentDate: null
        })
      )

      await this.reminderRepo.save(reminders)
      console.log(`Scheduled ${reminders.length} new reminders`)
    }
  }
}
