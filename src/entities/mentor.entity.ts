import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import Profile from './profile.entity'
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
  @JoinColumn()
  category: Category

  @Column({ type: 'json' })
  application: Record<string, unknown>

  @Column({ type: 'boolean' })
  availability: boolean

  @ManyToOne(() => Profile)
  @JoinColumn()
  profile: Profile

  @OneToMany(() => Mentee, (mentee) => mentee.mentor)
  mentees?: Mentee[]

  constructor(
    state: ApplicationStatus,
    category: Category,
    application: Record<string, unknown>,
    availability: boolean,
    profile: Profile
  ) {
    super()
    this.state = state
    this.category = category
    this.application = application
    this.availability = availability
    this.profile = profile
  }
}

export default Mentor
