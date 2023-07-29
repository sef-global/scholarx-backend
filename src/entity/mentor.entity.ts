import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import profileEntity from "./profile.entity";

@Entity("mentor")
export class Mentor {
    @PrimaryGeneratedColumn('uuid')
    id!: bigint
    // Should be Enum
    @Column()
    state: string
    // Should be Enum
    @Column()
    category: string

    @Column()
    application: JSON

    @Column({type: 'boolean'})
    availability: boolean

    @OneToOne(() => profileEntity)
    @JoinColumn()
    profile: profileEntity

    @CreateDateColumn()
    created_at: Date | undefined

    @UpdateDateColumn()
    updated_at: Date | undefined

    constructor(
        state: string,
        category: string,
        application: JSON,
        availability: boolean,
        profile: profileEntity
    ) {
        this.state = state;
        this.category = category;
        this.application = application;
        this.availability = availability;
        this.profile = profile;
    }
}
