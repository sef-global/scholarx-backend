import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {EmailStatusTypes} from "../enums/enums";
import {v4 as uuidv4} from 'uuid';


@Entity("email")
class Email {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column({type: 'varchar', length: 255})
    recipient: string

    @Column({type: 'varchar', length: 255})
    subject: string

    @Column({type: 'varchar', length: 655})
    content: string

    @Column({type: 'enum', enum: EmailStatusTypes})
    state: EmailStatusTypes

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    created_at: Date | undefined;

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    updated_at: Date | undefined;

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

    @BeforeInsert()
    @BeforeUpdate()
    updateTimestamps() {
        this.updated_at = new Date();
        if (!this.uuid) {
            this.created_at = new Date();
        }
    }

    @BeforeInsert()
    async generateUuid() {
        if (!this.uuid) {
            this.uuid = uuidv4();
        }
    }
}

export default Email;
