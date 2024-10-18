import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserProgressService } from '../userProgress/userProgress.service';
import { CreateUserProgressDto } from '../dto/createUserProgress.dto';

@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  // Create a new user progress for a section
  @Post('create')
  async createUserProgress(
    @Body() createUserProgressDto: CreateUserProgressDto,
  ) {
    const { userId, sectionId } = createUserProgressDto;
    const userProgress = await this.userProgressService.createUserProgress(
      userId,
      sectionId,
    );
    return {
      message: 'User progress created successfully',
      data: userProgress,
    };
  }

  // Update user progress when a question from a section is answered
  @Patch('update/:userId/:sectionId')
  async updateUserProgress(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ) {
    const updatedProgress = await this.userProgressService.updateUserProgress(
      userId,
      sectionId,
    );
    return {
      message: 'User progress updated successfully',
      data: updatedProgress,
    };
  }

  // Calculate progress for a specific section based on answered questions
  @Post('calculate-progress/:userId/:sectionId')
  async calculateSectionProgress(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ) {
    const progress = await this.userProgressService.calculateSectionProgress(
      userId,
      sectionId,
    );
    return { message: 'Progress calculated successfully', progress };
  }

  // Calculate overall progress across all sections for a user
  @Post('calculate-overall-progress/:userId')
  async calculateOverallProgress(@Param('userId') userId: number) {
    const overallProgress =
      await this.userProgressService.calculateOverallProgress(userId);
    return {
      message: 'Overall progress calculated successfully',
      overallProgress,
    };
  }

  // Get progress for a specific user and/or section
  @Get('progress')
  async getUserProgress(
    @Param('userId') userId?: number,
    @Param('sectionId') sectionId?: number,
  ) {
    const userProgress = await this.userProgressService.getUserProgress(
      userId,
      sectionId,
    );
    return { message: 'Progress retrieved successfully', data: userProgress };
  }

  // Get progress for a specific user and section combination
  @Get('progress/:userId/:sectionId')
  async getUserProgressByUserAndSection(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ) {
    const userProgress = await this.userProgressService.getUserProgress(
      userId,
      sectionId,
    );
    if (!userProgress || userProgress.length === 0) {
      return { message: 'No progress found for this user and section' };
    }
    return { message: 'Progress retrieved successfully', data: userProgress };
  }

  // Get all progress for a specific user
  @Get('all/:userId')
  async getAllUserProgress(@Param('userId') userId: number) {
    const userProgress = await this.userProgressService.getAllUserProgress(
      userId,
    );
    return {
      message: 'All progress retrieved successfully',
      data: userProgress,
    };
  }

  // Reset user progress for a specific section
  @Patch('reset/:userId/:sectionId')
  async resetUserProgress(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ) {
    const resetProgress = await this.userProgressService.resetUserProgress(
      userId,
      sectionId,
    );
    return { message: 'User progress reset successfully', data: resetProgress };
  }

  // Delete user progress for a specific section
  @Delete('delete/:userId')
  async deleteUserProgress(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ) {
    await this.userProgressService.deleteUserProgress(userId, sectionId);
    return { message: 'User progress deleted successfully' };
  }

  // Get completed sections for a user
  @Get('completed/:userId')
  async getCompletedSections(@Param('userId') userId: number) {
    const completedSections =
      await this.userProgressService.getCompletedSections(userId);
    return {
      message: 'Completed sections retrieved successfully',
      data: completedSections,
    };
  }
}
