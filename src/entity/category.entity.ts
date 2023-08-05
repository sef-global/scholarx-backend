import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity("category")
class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: bigint

    @Column({type: 'varchar', length: 255})
    category: string

    constructor(
        category: string,
    ) {
        this.category = category;
    }
}

export default Category;
