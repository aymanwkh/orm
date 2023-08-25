import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt'
import { classToPlain, Exclude } from 'class-transformer'

@Entity('users')
class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(5, 255, {message: 'name must be more than 4 characters'})
    name: string;

    @IsEmail()
    @Column({unique: true})
    email: string;

		@Exclude()
    @Column()
    password: string;

    @CreateDateColumn()
    created: Date

    @UpdateDateColumn()
    updated: Date

    @BeforeInsert()
    async hashPassword() {
			this.password = await bcrypt.hash(this.password, 6)
    }

		toJSON() {
			return classToPlain(this)
		}

}


export default User