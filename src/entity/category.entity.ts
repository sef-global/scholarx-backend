import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity('category')
class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date | undefined

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date | undefined

  @Column({ type: 'varchar', length: 255 })
  category: string

  constructor(category: string) {
    this.category = category
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

export default Category
