import cron from 'node-cron'
import { dataSource } from '../../configs/dbConfig'
import { MonthlyCheckInReminderService } from '../admin/reminder.service'
import { MonthlyReminder } from '../../entities/reminder.entity'
import Mentee from '../../entities/mentee.entity'

export class ReminderCronService {
  private readonly reminderService: MonthlyCheckInReminderService
  private cronJob!: cron.ScheduledTask

  constructor() {
    this.reminderService = new MonthlyCheckInReminderService(
      dataSource.getRepository(MonthlyReminder),
      dataSource.getRepository(Mentee)
    )
  }

  public start(): void {
    // Run at 1 AM every day
    this.cronJob = cron.schedule(
      '*/2 * * * *',
      async () => {
        try {
          console.info('Starting daily reminder processing')
          const startTime = Date.now()

          const result = await this.reminderService.processReminder()

          const duration = Date.now() - startTime
          console.info(`Completed reminder processing in ${duration}ms`, {
            result,
            duration
          })
        } catch (error) {
          console.error('Error in reminder cron job:', error)
        }
      },
      {
        scheduled: true,
        timezone: 'UTC'
      }
    )
  }

  public stop(): void {
    if (this.cronJob) {
      this.cronJob.stop()
    }
  }
}
