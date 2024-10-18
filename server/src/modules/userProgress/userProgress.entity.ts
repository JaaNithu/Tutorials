import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Section } from '../section/section.entity';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', { precision: 5, scale: 2 })
  progress: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: false })
  completionDate: Date | null;

  @ManyToOne(() => User, (user) => user.userProgress)
  user: User;

  @ManyToOne(() => Section, (section) => section.userProgress)
  section: Section;
}
