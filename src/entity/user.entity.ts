// src/entity/user.entity.ts
import bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'profile' })
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  contact_email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  image_url: string;

  @Column()
  linkedin_url: string;

  constructor(
    email: string,
    password: string,
    contact_email: string,
    first_name: string,
    last_name: string,
    image_url: string,
    linkedin_url: string
  ) {
    this.email = email;
    this.password = password;
    this.contact_email = contact_email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.image_url = image_url;
    this.linkedin_url = linkedin_url;
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export default User;
