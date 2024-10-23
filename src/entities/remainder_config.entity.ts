import { Entity, Column } from 'typeorm'
import BaseEntity from './baseEntity'

@Entity('remainder_config')
class RemainderConfig extends BaseEntity {
  @Column({ default: false })
  isEnable: boolean

  @Column({ type: 'varchar', length: 100, default: '0 9 1 * *' })
  remainderSchedule: string

  @Column({ type: 'int', default: 6 })
  mentorshipDurationMonths: number

  constructor(
    isEnable: boolean,
    remainderSchedule: string,
    mentorshipDurationMonths: number
  ) {
    super()
    this.isEnable = isEnable
    this.remainderSchedule = remainderSchedule
    this.mentorshipDurationMonths = mentorshipDurationMonths
  }
}

export default RemainderConfig
