import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../questions/question.entity";
import { UserProgress } from "../userProgress/userProgress.entity";

@Entity('sections')
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The section unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'The title of the section',
  })
  title: string;

  @Column({
    type: 'text',
    comment: 'The description of the section',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'The URL of the video for this section',
    nullable: false,
  })
  video_url: string;

  @Column({
    type: 'int',
    comment: 'Order of the section',
  })
  section_order: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Whether the section is active',
  })
  isActive: boolean;

  @OneToMany(() => Question, (question) => question.section)
  questions: Question[];

  @OneToMany(() => UserProgress, (userProgress) => userProgress.section)
  userProgress: UserProgress[];

}
