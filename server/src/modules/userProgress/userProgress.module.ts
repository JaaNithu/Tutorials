import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgressController } from '../userProgress/userProgress.controller';
import { UserProgressService } from '../userProgress/userProgress.service';
import { UserProgress } from '../userProgress/userProgress.entity';
import { User } from '../user/user.entity';
import { Section } from '../section/section.entity';
import { UserAnswerModule } from '../userAnswer/userAnswer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProgress, User, Section]),
    UserAnswerModule,
  ],
  controllers: [UserProgressController],
  providers: [UserProgressService],
})
export class UserProgressModule {}
