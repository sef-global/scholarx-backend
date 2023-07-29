import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {MenteeApplication} from "../types";

@Entity('mentee')
class Mentee {
    @PrimaryGeneratedColumn()
    id!: bigint

    @Column({type: "enum"})
    state: string

    @Column()
    answers: MenteeApplication

    @Column()
    certificate_id: bigint

    @Column()
    blogs: JSON

    @Column()
    profile_id: bigint

    @Column()
    mentor_id: bigint

    @CreateDateColumn()
    created_at: Date | undefined

    @UpdateDateColumn()
    updated_at: Date | undefined

    constructor(
        state: string,
        answers: MenteeApplication,
        certificate_id: bigint,
        blogs: JSON,
        profile_id: bigint,
        mentor_id: bigint
    ) {
        this.state = state;
        this.answers = answers;
        this.certificate_id = certificate_id;
        this.blogs = blogs;
        this.profile_id = profile_id;
        this.mentor_id = mentor_id;
    }
}
