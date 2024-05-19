import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import profileEntity from './profile.entity'
import Mentee from './mentee.entity'
import Category from './category.entity'
import { ApplicationStatus } from '../enums'
import BaseEntity from './baseEntity'

@Entity('mentor')
class Mentor extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  state: ApplicationStatus

  @ManyToOne(() => Category, (category) => category.mentors)
  category: Category

  @Column({ type: 'json' })
  application: Record<string, unknown>

  @Column({ type: 'boolean' })
  availability: boolean

  @ManyToOne(() => profileEntity)
  @JoinColumn()
  profile: profileEntity

  @OneToMany(() => Mentee, (mentee) => mentee.mentor)
  mentees: Mentee[]

  constructor(
    state: ApplicationStatus,
    category: Category,
    application: Record<string, unknown>,
    availability: boolean,
    profile: profileEntity,
    mentees: Mentee[]
  ) {
    super()
    this.state = state
    this.category = category
    this.application = application
    this.availability = availability
    this.profile = profile
    this.mentees = mentees
  }
}

export default Mentor
