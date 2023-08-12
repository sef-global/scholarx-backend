import bcrypt from 'bcrypt'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { ProfileTypes } from '../enums'

@Entity({ name: 'profile' })
class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  primary_email: string

  @Column({ type: 'varchar', length: 255 })
  contact_email: string

  @Column({ type: 'varchar', length: 255 })
  first_name: string

  @Column({ type: 'varchar', length: 255 })
  last_name: string

  @Column({ type: 'varchar', length: 255 })
  image_url: string

  @Column({ type: 'varchar', length: 255 })
  linkedin_url: string

  @Column({ type: 'enum', enum: ProfileTypes, default: ProfileTypes.DEFAULT })
  type: ProfileTypes

  @Column({ type: 'varchar', length: 255, select: false })
  password: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date | undefined

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date | undefined

  constructor(
    primary_email: string,
    contact_email: string,
    first_name: string,
    last_name: string,
    image_uri: string,
    linkedin_uri: string,
    type: ProfileTypes,
    password: string
  ) {
    this.primary_email = primary_email
    this.contact_email = contact_email
    this.first_name = first_name
    this.last_name = last_name
    this.image_url = image_uri
    this.linkedin_url = linkedin_uri
    this.type = type || ProfileTypes.DEFAULT
    this.password = password
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
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

export default Profile
