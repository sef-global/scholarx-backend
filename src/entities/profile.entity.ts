import bcrypt from 'bcrypt'
import { Entity, Column } from 'typeorm'
import { ProfileTypes } from '../enums'
import BaseEntity from './baseEntity'

@Entity({ name: 'profile' })
class Profile extends BaseEntity {
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
    super()
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
}

export default Profile
