import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import Mentor from './mentor.entity'
import profileEntity from './profile.entity'
import { MenteeApplicationStatus, StatusUpdatedBy } from '../enums'
import BaseEntity from './baseEntity'
import { UUID } from 'typeorm/driver/mongodb/bson.typings'
import MonthlyCheckIn from './checkin.entity'

@Entity('mentee')
class Mentee extends BaseEntity {
  @Column({
    type: 'enum',
    enum: MenteeApplicationStatus,
    default: MenteeApplicationStatus.PENDING
  })
  state: MenteeApplicationStatus

  @Column({ type: 'enum', enum: StatusUpdatedBy, nullable: true })
  status_updated_by!: StatusUpdatedBy

  @Column({ type: 'timestamp', nullable: true })
  status_updated_date!: Date

  @Column({ type: 'json' })
  application: Record<string, unknown>

  @Column({ type: 'uuid', nullable: true, default: null })
  certificate_id!: UUID

  @Column({ default: null, nullable: true })
  journal!: string

  @ManyToOne(() => profileEntity, (profile) => profile.mentee)
  profile: profileEntity

  @ManyToOne(() => Mentor, (mentor) => mentor.mentees)
  mentor: Mentor

  @OneToMany(() => MonthlyCheckIn, (checkIn) => checkIn.mentee)
  checkIns?: MonthlyCheckIn[]

  constructor(
    state: MenteeApplicationStatus,
    application: Record<string, unknown>,
    profile: profileEntity,
    mentor: Mentor,
    checkIns?: MonthlyCheckIn[]
  ) {
    super()
    this.state = state || MenteeApplicationStatus.PENDING
    this.application = application
    this.profile = profile
    this.mentor = mentor
    this.checkIns = checkIns
  }
}

export default Mentee
