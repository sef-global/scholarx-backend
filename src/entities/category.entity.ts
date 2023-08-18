import { Column, Entity } from 'typeorm'
import BaseEntity from './baseEntity'

@Entity('category')
class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  category: string

  constructor(category: string) {
    super()
    this.category = category
  }
}

export default Category
