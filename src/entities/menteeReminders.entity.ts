import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
} from 'typeorm'
import Mentee from './mentee.entity'
import { ReminderStatus } from '../enums'

@Entity('mentee_reminders')
class MenteeReminder extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  @Index({ unique: true })
  menteeId!: string

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING
  })
  status!: ReminderStatus

  @Column({ type: 'int', default: 0 })
  remindersSent!: number

  @Column({ type: 'timestamp', nullable: true })
  firstReminderSentAt?: Date | null

  @Column({ type: 'timestamp', nullable: true })
  lastReminderSentAt?: Date | null

  @Column({ type: 'timestamp', nullable: true })
  nextReminderDue?: Date | null

  @Column({ type: 'int', default: 0 })
  retryCount!: number

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt?: Date | null

  @Column({ type: 'varchar', nullable: true, length: 255 })
  lastErrorMessage?: string | null

  @Column({ type: 'boolean', default: false })
  isComplete!: boolean

  @OneToOne(() => Mentee)
  @JoinColumn({ name: 'menteeId' })
  mentee!: Mentee

  constructor(menteeId: string) {
    super()
    this.menteeId = menteeId
    this.remindersSent = 0
    this.retryCount = 0
    this.isComplete = false
  }
}

export default MenteeReminder
