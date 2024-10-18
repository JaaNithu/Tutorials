import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Question } from "../questions/question.entity";

@Entity('userAnswer')
export class UserAnswer extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answerText: string;

    @Column()
    isCorrect: boolean;

    @ManyToOne(() => User, (user) => user.userAnswer, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Question, (question) => question.userAnswer, { onDelete: 'CASCADE' })
    question: Question;

}