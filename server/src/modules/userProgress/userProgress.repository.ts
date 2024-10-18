import { Repository } from 'typeorm';
import { UserProgress } from '../userProgress/userProgress.entity';

export class UserProgressRepository extends Repository<UserProgress> {}
