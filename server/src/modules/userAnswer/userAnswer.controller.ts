import { Controller, Post, Body, Get, Param, NotFoundException, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UserAnswerService } from '../userAnswer/userAnswer.service';
import { CreateUserAnswerDto } from '../dto/createUserAnswer.dto';
import { UserAnswer } from '../userAnswer/userAnswer.entity';
import { UpdateUserAnswerDto } from '../dto/updateUserAnswer.dto';

@Controller('user-answers')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  // POST /user-answers
  @Post()
  async create(@Body() createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    // Call the service to create and store the user answer
    return this.userAnswerService.create(createUserAnswerDto);
  }

  // GET /user-answers (Find All)
  @Get()
  async findAll(): Promise<UserAnswer[]> {
    return this.userAnswerService.findAll();
  }

  // GET /user-answers/:id (Find One by ID)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserAnswer> {
    const userAnswer = await this.userAnswerService.findOne(id);
    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with ID ${id} not found`);
    }
    return userAnswer;
  }

  // PATCH /user-answers/:id (Update)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto
  ): Promise<UserAnswer> {
    const updatedUserAnswer = await this.userAnswerService.update(id, updateUserAnswerDto);
    if (!updatedUserAnswer) {
      throw new NotFoundException(`UserAnswer with ID ${id} not found`);
    }
    return updatedUserAnswer;
  }

  // DELETE /user-answers/:id (Delete)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.userAnswerService.remove(id);
    if (!result) {
      throw new NotFoundException(`UserAnswer with ID ${id} not found`);
    }
  }

  // GET /user-answers/user/:userId (Find by User ID)
  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<UserAnswer[]> {
    return this.userAnswerService.findByUserId(userId);
  }

}
