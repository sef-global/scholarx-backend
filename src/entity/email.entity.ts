import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {EmailTypes} from "../enums/enums";

@Entity("email")
class Email {
    @PrimaryGeneratedColumn('uuid')
    id!: bigint

    @Column({type: 'varchar', length: 255})
    recipient: string

    @Column({type: 'varchar', length: 255})
    subject: string

    @Column({type: 'varchar', length: 655})
    content: string

    @Column({type: 'enum', enum: EmailTypes})
    state: EmailTypes

    @CreateDateColumn()
    created_at: Date | undefined

    constructor(
        recipient: string,
        subject: string,
        content: string,
        state: EmailTypes
    ) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
        this.state = state;
    }
}

export default Email;
