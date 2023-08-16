import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { MenteeApplication } from '../types'
import Mentor from './mentor.entity'
import profileEntity from './profile.entity'
import { ApplicationStatus } from '../enums'
import BaseEntity from './baseEntity'

@Entity('mentee')
class Mentee extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  state: ApplicationStatus

  @Column({ type: 'json' })
  answers: MenteeApplication

  @Column({ type: 'bigint' })
  certificate_id: bigint

  @Column()
  journal: string

  @OneToOne(() => profileEntity)
  @JoinColumn()
  profile: profileEntity

  @ManyToOne(() => Mentor, (mentor) => mentor.mentees)
  mentor: Mentor

  constructor(
    state: ApplicationStatus,
    answers: MenteeApplication,
    certificate_id: bigint,
    journal: string,
    profile: profileEntity,
    mentor: Mentor
  ) {
    super()
    this.state = state
    this.answers = answers
    this.certificate_id = certificate_id
    this.journal = journal
    this.profile = profile
    this.mentor = mentor
  }
}

export default Mentee
