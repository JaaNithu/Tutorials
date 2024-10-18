import { Repository } from 'typeorm';
import { Question } from "./question.entity";


export class QuestionRepository extends Repository<Question> {}