import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import Profile from './profile.entity'
import Mentee from './mentee.entity'
import Category from './category.entity'
import { MentorApplicationStatus } from '../enums'
import BaseEntity from './baseEntity'
import { Country } from './country.entity'

@Entity('mentor')
class Mentor extends BaseEntity {
  @Column({
    type: 'enum',
    enum: MentorApplicationStatus,
    default: MentorApplicationStatus.PENDING
  })
  state: MentorApplicationStatus

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

  @ManyToOne(() => Country, (country) => country.mentors)
  @JoinColumn()
  country: Country

  @OneToMany(() => Mentee, (mentee) => mentee.mentor)
  mentees?: Mentee[]

  constructor(
    state: MentorApplicationStatus,
    category: Category,
    application: Record<string, unknown>,
    availability: boolean,
    profile: Profile,
    country: Country
  ) {
    super()
    this.state = state
    this.category = category
    this.application = application
    this.availability = availability
    this.profile = profile
    this.country = country
  }
}

export default Mentor
