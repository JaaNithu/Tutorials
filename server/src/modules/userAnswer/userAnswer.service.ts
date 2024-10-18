import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnswer } from '../userAnswer/userAnswer.entity';
import { CreateUserAnswerDto } from '../dto/createUserAnswer.dto';
import { Option } from '../options/option.entity';
import { Question } from '../questions/question.entity';
import { User } from '../user/user.entity';
import { UserProgressService } from '../userProgress/userProgress.service';
import { UpdateUserAnswerDto } from '../dto/updateUserAnswer.dto';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,

    @InjectRepository(Option)
    private optionRepository: Repository<Option>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userProgressService: UserProgressService
  ) {}

  // CREATE (create user answers)
  async create(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const { userId, questionId, answerText } = createUserAnswerDto;
  
    // Find the question by its ID (which includes the section it belongs to)
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['section'],
    });
  
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    // Find the correct option for the question
    const correctOption = await this.optionRepository.findOne({
      where: {
        question: { id: questionId },
        isCorrect: true,
      },
    });
  
    if (!correctOption) {
      throw new NotFoundException('Correct option not found');
    }
  
    // Compare the user's answer with the correct option
    const isCorrect = correctOption.text === answerText;
  
    // Create a new UserAnswer entity
    const userAnswer = this.userAnswerRepository.create({
      user: { id: userId },
      question: { id: questionId },
      answerText,
      isCorrect,
    });
  
    // Save the user's answer
    const savedAnswer = await this.userAnswerRepository.save(userAnswer);
  
    // Update the progress for the user based on the section
    await this.userProgressService.updateUserProgress(userId, question.section.id);
  
    return savedAnswer;
  }

  // READ (find all answers)
  async findAll(): Promise<UserAnswer[]> {
    return await this.userAnswerRepository.find({
      relations: ['user', 'question'],
    });
  }

  // READ (find one answer by ID)
  async findOne(id: number): Promise<UserAnswer> {
    const userAnswer = await this.userAnswerRepository.findOne({
      where: { id },
      relations: ['user', 'question'],
    });

    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with ID ${id} not found`);
    }

    return userAnswer;
  }

    // UPDATE
    async update(id: number, updateUserAnswerDto: UpdateUserAnswerDto): Promise<UserAnswer> {
      const { answerText, userId, questionId } = updateUserAnswerDto;
  
      // Find the existing user answer
      const userAnswer = await this.findOne(id);
      if (!userAnswer) {
        throw new NotFoundException(`UserAnswer with ID ${id} not found`);
      }
  
      // Find the question to update the correct option
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
        relations: ['section'],
      });
  
      if (!question) {
        throw new NotFoundException('Question not found');
      }
  
      const correctOption = await this.optionRepository.findOne({
        where: {
          question: { id: questionId },
          isCorrect: true,
        },
      });
  
      if (!correctOption) {
        throw new NotFoundException('Correct option not found');
      }
  
      const isCorrect = correctOption.text === answerText;
  
      // Update user answer details
      userAnswer.answerText = answerText;
      userAnswer.isCorrect = isCorrect;
      userAnswer.user = { id: userId } as User;
      userAnswer.question = { id: questionId } as Question;
  
      // Save the updated user answer
      const updatedUserAnswer = await this.userAnswerRepository.save(userAnswer);
  
      // Update the user's progress
      await this.userProgressService.updateUserProgress(userId, question.section.id);
  
      return updatedUserAnswer;
    }

    // DELETE
    async remove(id: number): Promise<boolean> {
      const result = await this.userAnswerRepository.delete(id);
      // result.affected gives the number of rows affected (deleted)
      return result.affected > 0;
    }

    async findByUserId(userId: number): Promise<UserAnswer[]> {
      const userAnswers = await this.userAnswerRepository.find({
        where: { user: { id: userId } },
        relations: ['question', 'question.options'], // Optionally include related questions
      });
  
      if (!userAnswers.length) {
        throw new NotFoundException(`No answers found for User ID ${userId}`);
      }
  
      return userAnswers;
    }
}
