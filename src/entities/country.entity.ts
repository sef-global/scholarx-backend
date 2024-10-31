import { Column, Entity, OneToMany } from 'typeorm'
import BaseEntity from './baseEntity'
import Mentor from './mentor.entity'

@Entity()
export class Country extends BaseEntity {
  @Column()
  code: string

  @Column()
  name: string

  @OneToMany(() => Mentor, (mentor) => mentor.country)
  mentors?: Mentor[]

  constructor(code: string, name: string) {
    super()
    this.code = code
    this.name = name
  }
}

export default Country
