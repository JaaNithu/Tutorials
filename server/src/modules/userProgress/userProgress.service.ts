import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from '../userProgress/userProgress.entity';
import { UserAnswer } from '../userAnswer/userAnswer.entity';
import { Question } from '../questions/question.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,

    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  // Create a new user progress entry for a section
  async createUserProgress(userId: number, sectionId: number): Promise<UserProgress> {
    // Check if progress already exists for this user and section
    const existingProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, section: { id: sectionId } },
    });

    if (existingProgress) {
      return existingProgress;
    }

    // Create new progress entry
    const userProgress = this.userProgressRepository.create({
      user: { id: userId },
      section: { id: sectionId },
      isCompleted: false,
    });

    return await this.userProgressRepository.save(userProgress);
  }

  // Update user progress for a section based on submitted answers
async updateUserProgress(userId: number, sectionId: number): Promise<UserProgress> {
  // Attempt to fetch the progress entry for the user and section
  let userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, section: { id: sectionId } },
  });

  // Create a new user progress if it does not exist
  if (!userProgress) {
      userProgress = await this.createUserProgress(userId, sectionId);
  }

  // Recalculate the progress based on correct answers
  const progressPercentage = await this.calculateSectionProgress(userId, sectionId);

  // Update progress
  userProgress.progress = progressPercentage;

  // Count the total number of answers given by the user for the section's questions
  const [totalAnswersGiven, totalQuestions] = await Promise.all([
    this.userAnswerRepository.count({
        where: {
            user: { id: userId },
            question: { section: { id: sectionId } },
        },
    }),
    this.questionRepository.count({
        where: { section: { id: sectionId } },
    }),
]);

  // Mark the section as completed if the user has answered all questions
  if (totalAnswersGiven === totalQuestions) {
      userProgress.isCompleted = true;
      userProgress.completionDate = new Date();
  }

  // Save the updated progress entry to the database
  return await this.userProgressRepository.save(userProgress);
}

  // Calculate progress for a user in a specific section based on answered questions
  async calculateSectionProgress(userId: number, sectionId: number): Promise<number> {
    // Get the total number of questions in the section
    const totalQuestions = await this.questionRepository.count({
      where: { section: { id: sectionId } },
    });

    // Get the number of correct answers provided by the user for the section
    const correctAnswers = await this.userAnswerRepository.count({
      where: {
        user: { id: userId },
        question: { section: { id: sectionId } },
        isCorrect: true,
      },
    });

    // Calculate the progress as a percentage
    if (totalQuestions === 0) return 0;
    return (correctAnswers / totalQuestions) * 100;
  }

  // Calculate overall progress for all sections the user is enrolled in
  async calculateOverallProgress(userId: number): Promise<number> {
    const userProgresses = await this.userProgressRepository.find({
      where: { user: { id: userId } },
    });

    if (userProgresses.length === 0) return 0;

    // Calculate total progress for each section
    let totalProgress = 0;
    for (const progress of userProgresses) {
      const sectionProgress = await this.calculateSectionProgress(userId, progress.section.id);
      totalProgress += sectionProgress;
    }

    // Calculate overall progress as an average
    return totalProgress / userProgresses.length;
  }

  // Fetch user progress by userId and/or sectionId
  async getUserProgress(userId?: number, sectionId?: number): Promise<UserProgress[]> {
    const query = this.userProgressRepository.createQueryBuilder('userProgress')
      .leftJoinAndSelect('userProgress.user', 'user')
      .leftJoinAndSelect('userProgress.section', 'section');
    
    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (sectionId) {
      query.andWhere('section.id = :sectionId', { sectionId });
    }

    return query.getMany();
  }

  // Fetch user progress for a specific section
async getUserProgressBySection(userId: number, sectionId: number): Promise<UserProgress> {
  const userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, section: { id: sectionId } },
      relations: ['user', 'section'],
  });

  if (!userProgress) {
      throw new NotFoundException(`Progress for user ID ${userId} and section ID ${sectionId} not found`);
  }

  return userProgress;
}

// Delete a user's progress for a specific section
async deleteUserProgress(userId: number, sectionId: number): Promise<void> {
  const userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, section: { id: sectionId } },
  });

  if (!userProgress) {
      throw new NotFoundException(`Progress for user ID ${userId} and section ID ${sectionId} not found`);
  }

  await this.userProgressRepository.remove(userProgress);
}

// Reset user progress for a section
async resetUserProgress(userId: number, sectionId: number): Promise<UserProgress> {
  const userProgress = await this.getUserProgressBySection(userId, sectionId);
  userProgress.isCompleted = false;
  userProgress.progress = 0;
  userProgress.completionDate = null; // Reset completion date

  return await this.userProgressRepository.save(userProgress);
}

// Fetch all user progress entries for a user
async getAllUserProgress(userId: number): Promise<UserProgress[]> {
  return await this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['section'],
  });
}

// Fetch completed sections for a user
async getCompletedSections(userId: number): Promise<UserProgress[]> {
  return await this.userProgressRepository.find({
      where: {
          user: { id: userId },
          isCompleted: true,
      },
      relations: ['section'],
  });
}


}
