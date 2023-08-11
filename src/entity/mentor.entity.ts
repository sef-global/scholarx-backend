import {
    BeforeInsert, BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import profileEntity from "./profile.entity";
import Mentee from "./mentee.entity";
import Category from "./category.entity";
import {v4 as uuidv4} from "uuid";

@Entity("mentor")
class Mentor {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

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

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    created_at: Date | undefined;

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    updated_at: Date | undefined;

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

    @BeforeInsert()
    @BeforeUpdate()
    updateTimestamps() : void {
        this.updated_at = new Date();
        if (!this.uuid) {
            this.created_at = new Date();
        }
    }

    @BeforeInsert()
    async generateUuid() : Promise<void> {
        if (!this.uuid) {
            this.uuid = uuidv4();
        }
    }
}

export default Mentor;
