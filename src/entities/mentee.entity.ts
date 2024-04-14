import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
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
  application: JSON

  @Column({ type: 'bigint', nullable: true, default: null })
  certificate_id!: bigint

  @Column({ default: null, nullable: true })
  journal!: string

  @OneToOne(() => profileEntity)
  @JoinColumn()
  profile: profileEntity

  @ManyToOne(() => Mentor, (mentor) => mentor.mentees)
  mentor: Mentor

  constructor(
    state: ApplicationStatus,
    application: JSON,
    profile: profileEntity,
    mentor: Mentor
  ) {
    super()
    this.state = state || ApplicationStatus.PENDING
    this.application = application
    this.profile = profile
    this.mentor = mentor
  }
}

export default Mentee
