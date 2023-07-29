import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

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
    // Should be ENUM
    @Column()
    state: string

    @CreateDateColumn()
    created_at: Date | undefined

    constructor(
        recipient: string,
        subject: string,
        content: string,
        state: string
    ) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
        this.state = state;
    }
}

export default Email;
