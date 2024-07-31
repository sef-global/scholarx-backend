import { randomUUID } from 'crypto'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm'

class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date | undefined

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date | undefined

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
      this.uuid = randomUUID()
    }
  }
}

export default BaseEntity
