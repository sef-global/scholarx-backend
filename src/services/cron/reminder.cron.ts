import cron from 'node-cron'
import { dataSource } from '../../configs/dbConfig'
import { MonthlyCheckInReminderService } from '../admin/reminder.service'
import { MonthlyReminder } from '../../entities/reminder.entity'
import Mentee from '../../entities/mentee.entity'
import CheckIn from '../../entities/checkin.entity'

export class ReminderCronService {
  private readonly reminderService: MonthlyCheckInReminderService
  private cronJob!: cron.ScheduledTask
  private readonly cronSchedule: string

  constructor() {
    this.reminderService = new MonthlyCheckInReminderService(
      dataSource.getRepository(MonthlyReminder),
      dataSource.getRepository(Mentee),
      dataSource.getRepository(CheckIn)
    )
    this.cronSchedule = process.env.REMINDER_CRON_SCHEDULE ?? '0 1 * * *' // Default to 1 AM every day

    if (!cron.validate(this.cronSchedule)) {
      throw new Error(`Invalid cron schedule: ${this.cronSchedule}`)
    }
  }

  public start(): void {
    this.cronJob = cron.schedule(
      this.cronSchedule,
      async () => {
        try {
          console.info('Starting daily reminder processing', {
            cronSchedule: this.cronSchedule,
            timeStamp: new Date().toISOString()
          })

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
