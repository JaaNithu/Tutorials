import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Section } from "../section/section.entity";
import { Option } from "../options/option.entity";

@Entity('question')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Section, (section) => section.questions, { eager: true })
  section: Section;

  @Column({ type: 'varchar' })
  question: string;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];
  userAnswer: any;

}
