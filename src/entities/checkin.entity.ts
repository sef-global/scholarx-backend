import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentee from './mentee.entity'

@Entity('monthly-check-in')
class MonthlyCheckIn extends BaseEntity {
  @Column({ type: 'text' })
  generalUpdatesAndFeedback: string

  @Column({ type: 'text' })
  progressTowardsGoals: string

  @Column({ type: 'json' })
  mediaContentLinks: string[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkInDate: Date

  @ManyToOne(() => Mentee, (mentee) => mentee.checkIns)
  @JoinColumn({ name: 'menteeId' })
  mentee: Mentee

  constructor(
    generalUpdatesAndFeedback: string,
    progressTowardsGoals: string,
    mediaContentLinks: string[],
    checkInDate: Date,
    mentee: Mentee
  ) {
    super()
    this.generalUpdatesAndFeedback = generalUpdatesAndFeedback
    this.progressTowardsGoals = progressTowardsGoals
    this.mediaContentLinks = mediaContentLinks
    this.checkInDate = checkInDate
    this.mentee = mentee
  }

  validate(): boolean {
    return this.mediaContentLinks.length >= 3
  }
}

export default MonthlyCheckIn
