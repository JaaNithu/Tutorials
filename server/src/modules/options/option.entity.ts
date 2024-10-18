import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../questions/question.entity";

@Entity('options')
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @ManyToOne(() => Question, question => question.options, { nullable: false })
  question: Question;
}
