import { ReminderStatus } from '../enums'
import BaseEntity from './baseEntity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import MenteeReminderConfig from './mentee_reminder_configs.entity'

@Entity('reminder_attempts')
class ReminderAttempt extends BaseEntity {
  @Column({ type: 'uuid' }) // Changed to uuid to match parent table
  menteeId!: string

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING
  })
  status!: ReminderStatus

  @Column({ type: 'int' })
  sequence!: number

  @Column({ default: 0 })
  retryCount!: number

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date

  @Column({ type: 'timestamp' })
  nextRetryAt!: Date

  @Column({ type: 'text', nullable: true })
  errorMessage?: string

  @ManyToOne(() => MenteeReminderConfig, (config) => config.attempts, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'menteeId', referencedColumnName: 'menteeId' })
  reminderConfig?: MenteeReminderConfig

  constructor(menteeId: string, sequence: number) {
    super()
    this.menteeId = menteeId
    this.sequence = sequence
    this.status = ReminderStatus.PENDING
    this.retryCount = 0
    this.nextRetryAt = new Date()
  }
}

export default ReminderAttempt
