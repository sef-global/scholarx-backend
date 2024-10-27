import { type Repository } from 'typeorm'
import { dataSource } from '../../configs/dbConfig'
import Mentee from '../../entities/mentee.entity'
import { MenteeApplicationStatus, ReminderStatus } from '../../enums'
import { getReminderEmailContent } from '../../utils'
import { sendEmail } from './email.service'
import MenteeReminderConfig from '../../entities/mentee_reminder_configs.entity'
import ReminderAttempt from '../../entities/reminder_attempts.entity'

export class EmailReminderService {
  private readonly configRepository: Repository<MenteeReminderConfig>
  private readonly menteeRepository: Repository<Mentee>
  private readonly attemptRepository: Repository<ReminderAttempt>
  private readonly maxRetries = 3
  private readonly batchSize = 5
  private readonly maxReminderSequence = 6
  private processingLock = false

  constructor() {
    this.configRepository = dataSource.getRepository(MenteeReminderConfig)
    this.menteeRepository = dataSource.getRepository(Mentee)
    this.attemptRepository = dataSource.getRepository(ReminderAttempt)
    console.log('EmailReminderService initialized')
  }

  public async scheduleReminders(): Promise<void> {
    console.log('Starting scheduleReminders')
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()
      console.log('Transaction started')

      const eligibleMentees = await this.menteeRepository
        .createQueryBuilder('m')
        .select([
          'm.uuid AS menteeId',
          'm.status_updated_date AS statusUpdatedDate',
          'p.primary_email AS email',
          'p.first_name AS firstName'
        ])
        .innerJoin('m.profile', 'p')
        .where('m.state = :state', {
          state: MenteeApplicationStatus.APPROVED
        })
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('rc.menteeId')
            .from(MenteeReminderConfig, 'rc')
            .getQuery()
          return 'm.uuid NOT IN ' + subQuery
        })
        .limit(this.batchSize)
        .getRawMany()

      console.log('Eligible mentees found:', eligibleMentees.length)

      if (eligibleMentees.length === 0) {
        console.log('No eligible mentees found')
        return
      }

      // Process each mentee sequentially within the transaction
      for (const mentee of eligibleMentees) {
        if (!mentee.menteeid || !mentee.email || !mentee.firstname) {
          console.warn('Invalid mentee data:', mentee)
          continue
        }

        // First, create and save the config
        const config = new MenteeReminderConfig(
          mentee.menteeid,
          mentee.email,
          mentee.firstname
        )
        const savedConfig = await queryRunner.manager.save(config)
        console.log(`Created config for mentee: ${mentee.menteeid}`)

        // Verify the config was saved
        const verifiedConfig = await queryRunner.manager.findOne(
          MenteeReminderConfig,
          {
            where: { menteeId: mentee.menteeid }
          }
        )

        if (!verifiedConfig) {
          throw new Error(`Config not saved for mentee: ${mentee.menteeid}`)
        }

        // Then create and save the attempt
        const attempt = new ReminderAttempt(savedConfig.menteeId, 1)
        attempt.nextRetryAt = new Date() // Set immediate retry
        await queryRunner.manager.save(attempt)
        console.log(`Created initial attempt for mentee: ${mentee.menteeid}`)
      }

      await queryRunner.commitTransaction()
      console.log('Transaction committed successfully')
    } catch (error) {
      console.error('Error in scheduleReminders:', error)
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  public async processReminders(): Promise<void> {
    console.log('Starting processReminders')
    if (this.processingLock) {
      console.log('Processing locked, skipping')
      return
    }

    try {
      this.processingLock = true
      console.log('Processing lock acquired')

      const pendingReminders = await this.getPendingAttempts()
      console.log('Pending reminders found:', pendingReminders.length)

      for (const attempt of pendingReminders) {
        console.log(`Processing reminder for mentee: ${attempt.menteeId}`)
        const config = await this.configRepository.findOne({
          where: { menteeId: attempt.menteeId }
        })

        if (!config) {
          console.warn(`No config found for mentee: ${attempt.menteeId}`)
          continue
        }

        await this.processReminderWithTransaction(attempt, config)
      }
    } catch (error) {
      console.error('Error in processReminders:', error)
      throw error
    } finally {
      this.processingLock = false
      console.log('Processing lock released')
    }
  }

  private async processReminderWithTransaction(
    attempt: ReminderAttempt,
    config: MenteeReminderConfig
  ): Promise<void> {
    console.log(`Starting reminder transaction for mentee: ${attempt.menteeId}`)
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()

      // Update attempt status first
      attempt.status = ReminderStatus.PROCESSING
      await queryRunner.manager.save(attempt)

      // Send email
      const emailContent = getReminderEmailContent(config.firstName)
      await sendEmail(config.email, emailContent.subject, emailContent.message)

      // Update attempt and config
      attempt.status = ReminderStatus.COMPLETE
      attempt.processedAt = new Date()
      config.currentSequence = attempt.sequence
      config.lastReminderSentAt = new Date()

      if (config.currentSequence === 0) {
        config.firstReminderSentAt = new Date()
      }

      // Save config first
      await queryRunner.manager.save(config)

      if (attempt.sequence === this.maxReminderSequence) {
        config.isComplete = true
      } else {
        const nextDue = new Date()
        nextDue.setMonth(nextDue.getMonth() + 1)
        config.nextReminderDue = nextDue

        // Create and save next attempt after config is saved
        const nextAttempt = new ReminderAttempt(
          attempt.menteeId,
          attempt.sequence + 1
        )
        await queryRunner.manager.save(nextAttempt)
      }

      // Save the current attempt
      await queryRunner.manager.save(attempt)

      // Update mentee
      await queryRunner.manager.update(
        Mentee,
        { uuid: config.menteeId },
        { last_monthlycheck_reminder_date: new Date() }
      )

      await queryRunner.commitTransaction()
    } catch (error) {
      console.error(
        `Error processing reminder for mentee ${config.menteeId}:`,
        error
      )
      await queryRunner.rollbackTransaction()
      await this.handleReminderError(attempt, error as Error)
    } finally {
      await queryRunner.release()
    }
  }

  private async handleReminderError(
    attempt: ReminderAttempt,
    error: Error
  ): Promise<void> {
    console.log(
      `Handling error for attempt ${attempt.sequence}:`,
      error.message
    )
    attempt.retryCount += 1
    attempt.status = ReminderStatus.FAILED
    attempt.errorMessage = error.message

    if (attempt.retryCount < this.maxRetries) {
      const backoffMinutes = Math.pow(2, attempt.retryCount) * 5
      attempt.nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000)
      console.log(`Scheduled retry in ${backoffMinutes} minutes`)
      await this.attemptRepository.save(attempt)
    } else {
      console.error(`Max retries reached for attempt ${attempt.sequence}`)
    }
  }

  private async getPendingAttempts(): Promise<ReminderAttempt[]> {
    console.log('Fetching pending attempts')
    return await this.attemptRepository
      .createQueryBuilder('attempt')
      .innerJoin(
        MenteeReminderConfig,
        'config',
        'config.menteeId = attempt.menteeId'
      )
      .where('attempt.status IN (:...statuses)', {
        statuses: [ReminderStatus.PENDING, ReminderStatus.FAILED]
      })
      .andWhere('attempt.retryCount < :maxRetries', {
        maxRetries: this.maxRetries
      })
      .andWhere('config.isComplete = :isComplete', {
        isComplete: false
      })
      .andWhere('config.nextReminderDue <= :now', {
        now: new Date()
      })
      .limit(this.batchSize)
      .getMany()
  }
}
