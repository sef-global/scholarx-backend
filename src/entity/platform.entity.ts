import {
    BeforeInsert, BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {v4 as uuidv4} from "uuid";

@Entity("platform")
class Platform {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column()
    description: string

    @Column()
    mentor_questions: JSON

    @Column()
    image_url: string

    @Column()
    landing_page_url: string

    @Column()
    email_templates: JSON

    @Column({type: 'varchar', length: 255})
    title: string

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    created_at: Date | undefined;

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    updated_at: Date | undefined;

    constructor(
        description: string,
        mentor_questions: JSON,
        image_url: string,
        landing_page_url: string,
        email_templates: JSON,
        title: string,
    ) {
        this.description = description;
        this.mentor_questions = mentor_questions;
        this.image_url = image_url;
        this.landing_page_url = landing_page_url;
        this.email_templates = email_templates;
        this.title = title;
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

export default Platform;
