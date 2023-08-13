import { Column, Entity } from 'typeorm'
import BaseEntity from './baseEntity'

@Entity('platform')
class Platform extends BaseEntity {
  @Column()
  description: string

  @Column({ type: 'json' })
  mentor_questions: JSON

  @Column()
  image_url: string

  @Column()
  landing_page_url: string

  @Column({ type: 'json' })
  email_templates: JSON

  @Column({ type: 'varchar', length: 255 })
  title: string

  constructor(
    description: string,
    mentor_questions: JSON,
    image_url: string,
    landing_page_url: string,
    email_templates: JSON,
    title: string
  ) {
    super()
    this.description = description
    this.mentor_questions = mentor_questions
    this.image_url = image_url
    this.landing_page_url = landing_page_url
    this.email_templates = email_templates
    this.title = title
  }
}

export default Platform
