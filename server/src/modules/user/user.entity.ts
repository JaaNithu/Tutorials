import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserAnswer } from "../userAnswer/userAnswer.entity";
import { UserProgress } from "../userProgress/userProgress.entity";
import { IsEmail, IsIn, IsNotEmpty, Length, Matches } from "class-validator";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
@Unique(['email', 'id'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Column({
        unique: true,
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @Column()
    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
        message:
            'Password must include uppercase, lowercase, number, and special character',
        },
    )
    password: string;

    @Column({
        type: 'int',
        transformer: {
        to: (value: string): number => {
            if (value === 'admin') {
            return 1;
            } else if (value === 'user') {
            return 0;
            } else {
            throw new Error('Invalid role');
            }
        },
        from: (value: number): string => {
            return value === 1 ? 'admin' : 'user';
        },
        },
    })
    @IsNotEmpty()
    @IsIn(['admin', 'user'])
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
    userAnswer: UserAnswer;

    @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
    userAnswers: UserAnswer[];

    @OneToMany(() => UserProgress, (userProgress) => userProgress.user)
    userProgress: UserProgress[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}