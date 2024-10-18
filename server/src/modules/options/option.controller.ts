import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe, NotFoundException } from "@nestjs/common";
import { OptionService } from "./option.service";
import { QuestionService } from '../questions/question.service';
import { CreateOptionDto } from "../dto/createOption.dto";
import { UpdateOptionDto } from "../dto/updateOption.dto";

@Controller('question/option')
export class OptionController {
    constructor(
        private readonly optionService: OptionService,
        private readonly questionService: QuestionService,
    ) {}

    // GET /question/option -> Get all options
    @Get('/')
    async getAllOptions() {
        const options = await this.optionService.getAllOptions();
        return { success: true, options };
    }

    // POST /question/option -> Create and attach an option to a question
    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    async saveOptionToQuestion(@Body() createOptionDto: CreateOptionDto) {
        const question = await this.questionService.findQuestionById(createOptionDto.questionId);
        
        if (!question) {
            throw new NotFoundException(`Question with ID ${createOptionDto.questionId} not found`);
        }

        const option = await this.optionService.createOption(createOptionDto, question);
        return { success: true, message: 'Option created successfully', option };
    }

    // GET /question/option/:questionId -> Get all options for a specific question
    @Get(':questionId')
    async getOptionsForQuestion(@Param('questionId') questionId: string) {
        const options = await this.optionService.getOptionsForQuestion(Number(questionId));
        return { success: true, questionId, options };
    }

    // GET /question/option/:optionId -> Get a specific option by its ID
    @Get('/:optionId')
    async getOptionById(@Param('optionId') optionId: string) {
        const option = await this.optionService.getOptionById(Number(optionId));
        return { success: true, option };
    }

    // PATCH /question/option/:optionId -> Update an existing option
    @Patch('/:optionId')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateOption(
        @Param('optionId') optionId: string,
        @Body() updateOptionDto: UpdateOptionDto
    ) {
        const updatedOption = await this.optionService.updateOption(Number(optionId), updateOptionDto);
        return { success: true, message: 'Option updated successfully', updatedOption };
    }

    // DELETE /question/option/:optionId -> Delete an option
    @Delete('/:optionId')
    async deleteOption(@Param('optionId') optionId: string) {
        await this.optionService.deleteOption(Number(optionId));
        return { success: true, message: 'Option deleted successfully' };
    }
}
