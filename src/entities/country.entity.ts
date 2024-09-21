import { Column, Entity } from 'typeorm'
import BaseEntity from './baseEntity'

@Entity()
export class Country extends BaseEntity {
  @Column()
  code: string

  @Column()
  name: string

  constructor(code: string, name: string) {
    super()
    this.code = code
    this.name = name
  }
}
