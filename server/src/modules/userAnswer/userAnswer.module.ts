import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswerController } from '../userAnswer/userAnswer.controller';
import { UserAnswerService } from '../userAnswer/userAnswer.service';
import { UserAnswer } from '../userAnswer/userAnswer.entity';
import { Option } from '../options/option.entity';
import { Question } from '../questions/question.entity';
import { User } from '../user/user.entity';
import { UserProgress } from '../userProgress/userProgress.entity';
import { UserProgressService } from '../userProgress/userProgress.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAnswer, Option, Question, User, UserProgress]),
  ],
  controllers: [UserAnswerController],
  providers: [UserAnswerService, UserProgressService],
  exports: [TypeOrmModule],
})
export class UserAnswerModule {}
