import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import profileEntity from "./profile.entity";
import Mentee from "./mentee.entity";
import Category from "./category.entity";

@Entity("mentor")
class Mentor {
    @PrimaryGeneratedColumn('uuid')
    id!: bigint

    @Column({type: 'varchar', length: 255})
    state: string

    @OneToMany(() => Category, category => category.category)
    category: Category

    @Column()
    application: JSON

    @Column({type: 'boolean'})
    availability: boolean

    @OneToOne(() => profileEntity)
    @JoinColumn()
    profile: profileEntity

    @OneToMany(() => Mentee, mentee => mentee.mentor)
    mentees: Mentee[];

    @CreateDateColumn()
    created_at: Date | undefined

    @UpdateDateColumn()
    updated_at: Date | undefined

    constructor(
        state: string,
        category: Category,
        application: JSON,
        availability: boolean,
        profile: profileEntity,
        mentees: Mentee[]
    ) {
        this.state = state;
        this.category = category;
        this.application = application;
        this.availability = availability;
        this.profile = profile;
        this.mentees =mentees;
    }
}

export default Mentor;
