import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentee from './mentee.entity'

@Entity('monthly-check-in')
class MonthlyCheckIn extends BaseEntity {
  @Column({ type: 'text' })
  title: string

  @Column({ type: 'text' })
  generalUpdatesAndFeedback: string

  @Column({ type: 'text' })
  progressTowardsGoals: string

  @Column({ type: 'json' })
  mediaContentLinks: string[]

  @Column({ type: 'json', nullable: true })
  tags: string[]

  @Column({ type: 'text', nullable: true })
  mentorFeedback: string

  @Column({ type: 'boolean', default: false })
  isCheckedByMentor: boolean

  @Column({ type: 'timestamp', nullable: true })
  mentorCheckedDate: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkInDate: Date

  @ManyToOne(() => Mentee, (mentee) => mentee.checkIns)
  @JoinColumn({ name: 'menteeId' })
  mentee: Mentee

  constructor(
    title: string,
    generalUpdatesAndFeedback: string,
    progressTowardsGoals: string,
    mediaContentLinks: string[],
    mentorFeedback: string,
    tags: string[],
    isCheckedByMentor: boolean,
    mentorCheckedDate: Date,
    checkInDate: Date,
    mentee: Mentee
  ) {
    super()
    this.title = title
    this.generalUpdatesAndFeedback = generalUpdatesAndFeedback
    this.progressTowardsGoals = progressTowardsGoals
    this.mediaContentLinks = mediaContentLinks
    this.tags = tags
    this.mentorFeedback = mentorFeedback
    this.isCheckedByMentor = isCheckedByMentor
    this.mentorCheckedDate = mentorCheckedDate
    this.checkInDate = checkInDate
    this.mentee = mentee
  }

  validate(): boolean {
    return this.mediaContentLinks.length >= 3
  }
}

export default MonthlyCheckIn
