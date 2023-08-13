import { Column, Entity } from 'typeorm'
import { EmailStatusTypes } from '../enums'
import BaseEntity from './baseEntity'

@Entity('email')
class Email extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  recipient: string

  @Column({ type: 'varchar', length: 255 })
  subject: string

  @Column({ type: 'varchar', length: 655 })
  content: string

  @Column({ type: 'enum', enum: EmailStatusTypes })
  state: EmailStatusTypes

  constructor(
    recipient: string,
    subject: string,
    content: string,
    state: EmailStatusTypes
  ) {
    super()
    this.recipient = recipient
    this.subject = subject
    this.content = content
    this.state = state
  }
}

export default Email
