import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { MenteeApplication } from '../types'
import Mentor from './mentor.entity'
import profileEntity from './profile.entity'
import { MenteeStateTypes } from '../enums'
import { v4 as uuidv4 } from 'uuid'

@Entity('mentee')
class Mentee {
  @PrimaryGeneratedColumn()
  uuid!: string

  @Column({
    type: 'enum',
    enum: MenteeStateTypes,
    default: MenteeStateTypes.PENDING
  })
  state: MenteeStateTypes

  @Column({ type: 'json' })
  answers: MenteeApplication

  @Column({ type: 'bigint' })
  certificate_id: bigint

  @Column()
  blogs: string

  @OneToOne(() => profileEntity)
  @JoinColumn()
  profile: profileEntity

  @ManyToOne(() => Mentor, (mentor) => mentor.mentees)
  mentor: Mentor

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date | undefined

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date | undefined

  constructor(
    state: MenteeStateTypes,
    answers: MenteeApplication,
    certificate_id: bigint,
    blogs: string,
    profile: profileEntity,
    mentor: Mentor
  ) {
    this.state = state
    this.answers = answers
    this.certificate_id = certificate_id
    this.blogs = blogs
    this.profile = profile
    this.mentor = mentor
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamps(): void {
    this.updated_at = new Date()
    if (!this.uuid) {
      this.created_at = new Date()
    }
  }

  @BeforeInsert()
  async generateUuid(): Promise<void> {
    if (!this.uuid) {
      this.uuid = uuidv4()
    }
  }
}

export default Mentee
