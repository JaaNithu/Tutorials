import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, HttpCode, UsePipes, ValidationPipe, ParseIntPipe } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "../dto/createQuestion.dto";
import { UpdateQuestionDto } from "../dto/updateQuestion.dto";
import { Question } from "./question.entity";
import { Section } from "../section/section.entity"; // Assuming Section is imported as needed
import { SectionService } from "../section/section.service";

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService, private readonly sectionService: SectionService) {}

    // Create a new question
    @Post()
    async createQuestion(
        @Body() createQuestionDto: CreateQuestionDto,
    ): Promise<Question> {
        createQuestionDto.sectionId;
        return this.questionService.createQuestion(createQuestionDto);
    }


    // Get all questions
    @Get()
    async getAllQuestions(): Promise<Question[]> {
        return this.questionService.getAllQuestions();
    }

    // Get a specific question by ID
    @Get(':id')
    async getQuestionById(@Param('id') id: number): Promise<Question> {
        return this.questionService.findQuestionById(id);
    }

    // Update a specific question by ID
    @Put('/:id')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateQuestion(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        return this.questionService.updateQuestion(id, updateQuestionDto);
    }

    // Delete a specific question by ID
    @Delete('delete/:id')
    async deleteQuestion(@Param('id') id: number): Promise<void> {
        return this.questionService.deleteQuestion(id);
    }

    // Get questions by section
    @Get('section/:sectionId')
    async getQuestionsBySection(@Param('sectionId') sectionId: number): Promise<Question[]> {
        return this.questionService.getQuestionsBySection(sectionId);
    }
}
