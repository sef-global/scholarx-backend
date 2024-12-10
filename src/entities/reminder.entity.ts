import { Column, Entity, ManyToOne } from 'typeorm'
import BaseEntity from './baseEntity'
import { ReminderStatus } from '../enums'
import Mentee from './mentee.entity'

@Entity('monthly_reminders')
export class MonthlyReminder extends BaseEntity {
  @ManyToOne(() => Mentee, (mentee) => mentee.reminders)
  mentee!: Mentee

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING
  })
  status!: ReminderStatus

  @Column({ type: 'text', nullable: true })
  lastError!: string

  @Column({ type: 'int', default: 0 })
  remindersSent!: number

  @Column({ type: 'timestamp', nullable: true })
  nextReminderDate!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  lastSentDate!: Date | null
}
