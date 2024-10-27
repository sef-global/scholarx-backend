import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentee from './mentee.entity'

@Entity('failed_reminders')
class FailedReminders extends BaseEntity {
  @Column({ type: 'text' })
  error: string

  @ManyToOne(() => Mentee, (mentee) => mentee.failedReminders)
  @JoinColumn({ name: 'menteeId' })
  mentee: Mentee

  constructor(error: string, mentee: Mentee) {
    super()
    this.error = error
    this.mentee = mentee
  }
}

export default FailedReminders
