import { Entity, Column, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentee from './mentee.entity'
import ReminderAttempt from './reminder_attempts.entity'

@Entity('mentee_reminder_configs')
class MenteeReminderConfig extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  @Index({ unique: true }) // Add unique constraint
  menteeId!: string

  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  firstName!: string

  @Column({ type: 'timestamp', nullable: true })
  firstReminderSentAt?: Date

  @Column({ type: 'int', default: 0 })
  currentSequence!: number

  @Column({ type: 'timestamp', nullable: true })
  lastReminderSentAt?: Date

  @Column({ type: 'timestamp' })
  nextReminderDue!: Date

  @Column({ type: 'boolean', default: false })
  isComplete!: boolean

  @OneToOne(() => Mentee)
  @JoinColumn({ name: 'menteeId' })
  mentee!: Mentee

  @OneToMany(() => ReminderAttempt, (attempt) => attempt.reminderConfig)
  attempts?: ReminderAttempt[]

  constructor(menteeId: string, email: string, firstName: string) {
    super()
    this.menteeId = menteeId
    this.email = email
    this.firstName = firstName
    this.currentSequence = 0
    this.nextReminderDue = new Date()
    this.isComplete = false
  }
}

export default MenteeReminderConfig
