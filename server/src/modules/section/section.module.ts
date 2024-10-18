import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionRepository } from './section.repository';
import { QuestionController } from '../questions/question.controller';
import { QuestionService } from '../questions/question.service';
import { QuestionRepository } from '../questions/question.repository';
import { OptionRepository } from '../options/option.repository';
import { OptionController } from '../options/option.controller';
import { OptionService } from '../options/option.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionRepository, QuestionRepository, OptionRepository])],
  controllers: [SectionController, QuestionController, OptionController],
  providers: [SectionService, QuestionService, OptionService],
  exports: [SectionService, QuestionService, OptionService, ],
})
export class SectionModule {}
