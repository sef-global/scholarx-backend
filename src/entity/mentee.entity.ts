import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {MenteeApplication} from "../types";
import Mentor from "./mentor.entity";
import profileEntity from "./profile.entity";

@Entity('mentee')
class Mentee {
    @PrimaryGeneratedColumn()
    id!: bigint

    @Column()
    state: string

    @Column()
    answers: MenteeApplication

    @Column()
    certificate_id: bigint

    @Column()
    blogs: JSON

    @OneToOne(() => profileEntity)
    @JoinColumn()
    profile: profileEntity

    @ManyToOne(() => Mentor, mentor => mentor.mentees)
    mentor: Mentor

    @CreateDateColumn()
    created_at: Date | undefined

    @UpdateDateColumn()
    updated_at: Date | undefined

    constructor(
        state: string,
        answers: MenteeApplication,
        certificate_id: bigint,
        blogs: JSON,
        profile: profileEntity,
        mentor: Mentor
    ) {
        this.state = state;
        this.answers = answers;
        this.certificate_id = certificate_id;
        this.blogs = blogs;
        this.profile = profile;
        this.mentor = mentor;
    }
}

export default Mentee;
