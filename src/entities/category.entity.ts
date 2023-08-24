import { Column, Entity, OneToMany } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentor from './mentor.entity'
@Entity('category')
class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  category: string

  @OneToMany(() => Mentor, (mentor) => mentor.category)
  mentors: Mentor[]

  constructor(category: string, mentors: Mentor[]) {
    super()
    this.category = category
    this.mentors = mentors
  }
}

export default Category
