import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateQuestionDto } from "../dto/createQuestion.dto";
import { QuestionRepository } from "./question.repository";
import { Question } from "./question.entity";
import { DataSource, Repository } from "typeorm";
import { Section } from "../section/section.entity";
import { Option } from "../options/option.entity";
import { UpdateQuestionDto } from "../dto/updateQuestion.dto";
import { OptionService } from "../options/option.service";
import { SectionRepository } from "../section/section.repository";
import { OptionRepository } from "../options/option.repository";

@Injectable()
export class QuestionService {
    private questionRepository: QuestionRepository;
    private sectionRepository: SectionRepository;
    private optionRepository: OptionRepository;

    constructor(
        private dataSource: DataSource,
        private readonly optionService: OptionService,
    ) {
        this.questionRepository = this.dataSource.getRepository(Question).extend(QuestionRepository);
        this.sectionRepository = this.dataSource.getRepository(Section);
        this.optionRepository = this.dataSource.getRepository(Option);
    }

    async findQuestionById(id: number): Promise<Question> {
        const question = await this.questionRepository.findOne({ where: { id }, relations: ['section', 'options'] });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
        // Fetch the section using sectionId from DTO
        const section = await this.sectionRepository.findOne({ where: { id: createQuestionDto.sectionId } });
        console.log('Received sectionId:', createQuestionDto.sectionId);
        
        // Ensure the section exists
        if (!section) {
            throw new Error(`Section with id ${createQuestionDto.sectionId} not found`);
        }
    
        // Create a new question and associate it with the section
        const newQuestion = this.questionRepository.create({
            question: createQuestionDto.question,
            section: section,
        });
    
        // Save the new question to the repository
        await this.questionRepository.save(newQuestion);
    
        // Handle options if available
        if (createQuestionDto.options) {
            for (const optionDto of createQuestionDto.options) {
                await this.optionService.createOption(optionDto, newQuestion);
            }
        }
    
        return newQuestion;
    }

    async getAllQuestions(): Promise<Question[]> {
        return await this.questionRepository.find({ relations: ['section', 'options'] });
    }

    async updateQuestion(id: number, questionDto: UpdateQuestionDto): Promise<Question> {
        try {
            const question = await this.findQuestionById(id);
            if (!question) {
                throw new Error(`Question with ID ${id} not found.`);
            }
    
            if (questionDto.question) {
                question.question = questionDto.question;
            }
    
            if (questionDto.sectionId) {
                const section = await this.sectionRepository.findOne({ where: { id: questionDto.sectionId } });
                if (!section) {
                    throw new Error(`Section with ID ${questionDto.sectionId} does not exist`);
                }
                question.section = section;
            }
    
            if (questionDto.options) {
                const updatedOptionIds = new Set<number>();
                for (const optionDto of questionDto.options) {
                    if (optionDto.optionId) {
                        const existingOption = question.options.find(option => option.id === optionDto.optionId);
                        if (existingOption) {
                            updatedOptionIds.add(existingOption.id);
                            existingOption.text = optionDto.text !== undefined ? optionDto.text : existingOption.text;
                            existingOption.isCorrect = optionDto.isCorrect !== undefined ? optionDto.isCorrect : existingOption.isCorrect;
                        }
                    } else {
                        // If the option doesn't have an ID, create a new one
                        const newOption = this.optionRepository.create(optionDto);
                        question.options.push(newOption);
                    }
                }
    
                // Update the options only for those that exist and have the updated isCorrect flag
                question.options = question.options.filter(option => updatedOptionIds.has(option.id));
            }
    
            return await this.questionRepository.save(question);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Rethrow custom error
            }
            console.error('Error while updating question:', error);
            throw new InternalServerErrorException("Failed to update question: " + error.message);
        }
    }

    async deleteQuestion(questionId: number): Promise<void> {
        // Step 1: Find the question
        const question = await this.questionRepository.findOne({ where: { id: questionId }, relations: ['options'] });
        
        // Step 2: Check if the question exists
        if (!question) {
          throw new NotFoundException(`Question with ID ${questionId} not found.`);
        }
    
        // Step 3: Check what options the question contains
        const options = question.options;
    
        // Step 4: Delete associated options (if not using cascading delete)
        if (options && options.length > 0) {
          await this.optionRepository.delete(options.map(option => option.id));
        }
    
        // Step 5: Delete the question
        await this.questionRepository.delete(questionId);
    }

    async getQuestionsBySection(sectionId: number): Promise<Question[]> {
        return await this.questionRepository.find({ where: { section: { id: sectionId } }, relations: ['options'] });
    }
}
