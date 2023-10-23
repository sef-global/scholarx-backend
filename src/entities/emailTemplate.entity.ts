import { Column, Entity } from 'typeorm'
import BaseEntity from './baseEntity'

@Entity('emailTemplate')
class EmailTemplate extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  subject: string

  @Column({ type: 'varchar', length: 655 })
  content: string

  constructor(subject: string, content: string) {
    super()
    this.subject = subject
    this.content = content
  }
}

export default EmailTemplate
