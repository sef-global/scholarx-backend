import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {EmailStatusTypes} from "../enums/enums";

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

    @Column({type: 'enum', enum: EmailStatusTypes})
    state: EmailStatusTypes

    @CreateDateColumn()
    created_at: Date | undefined

    constructor(
        recipient: string,
        subject: string,
        content: string,
        state: EmailStatusTypes
    ) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
        this.state = state;
    }
}

export default Email;
