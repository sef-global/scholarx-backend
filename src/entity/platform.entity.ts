import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("platform")
class Platform {
    @PrimaryGeneratedColumn('uuid')
    id!: bigint

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

    @Column({type: 'varchar', length: 255})
    category: string

    @CreateDateColumn()
    created_at: Date | undefined

    @UpdateDateColumn()
    updated_at: Date | undefined

    constructor(
        description: string,
        mentor_questions: JSON,
        image_url: string,
        landing_page_url: string,
        email_templates: JSON,
        title: string,
        category: string,
    ) {
        this.description = description;
        this.mentor_questions = mentor_questions;
        this.image_url = image_url;
        this.landing_page_url = landing_page_url;
        this.email_templates = email_templates;
        this.title = title;
        this.category = category;
    }
}

export default Platform;
