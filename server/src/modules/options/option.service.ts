import { Injectable, NotFoundException } from "@nestjs/common";
import { OptionRepository } from './option.repository';
import { DataSource } from "typeorm";
import { Option } from "./option.entity";
import { CreateOptionDto } from "../dto/createOption.dto";
import { Question } from "../questions/question.entity";
import { UpdateOptionDto } from "../dto/updateOption.dto";

@Injectable()
export class OptionService {
  private optionRepository: OptionRepository;

  constructor(private dataSource: DataSource) {
    this.optionRepository = this.dataSource.getRepository(Option).extend(OptionRepository);
  }

  // Get all options
  async getAllOptions(): Promise<Option[]> {
    const options = await this.optionRepository.find();
    if (!options.length) {
      throw new NotFoundException(`No options found`);
    }
    return options;
  }

  // Create a new option
  async createOption(
    optionDto: CreateOptionDto,
    question: Question,
): Promise<Option> {
    const newOption = this.optionRepository.create({
        text: optionDto.text,
        isCorrect: optionDto.isCorrect,
        question: question,
    });

    return await this.optionRepository.save(newOption);
}


  // Get all options for a specific question
  async getOptionsForQuestion(questionId: number): Promise<Option[]> {
    const options = await this.optionRepository.find({
      where: { question: { id: questionId } },
    });

    if (!options.length) {
      throw new NotFoundException(`No options found for question ID ${questionId}`);
    }

    return options;
  }

  // Get a single option by its ID
  async getOptionById(optionId: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { id: optionId },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${optionId} not found`);
    }

    return option;
  }

  // Update an existing option
  async updateOption(optionId: number, optionDto: UpdateOptionDto): Promise<Option> {
    const option = await this.getOptionById(optionId);

    // Update properties if they are provided in the DTO
    option.text = optionDto.text;
    option.isCorrect = optionDto.isCorrect;
    option.question = option.question;

    return await this.optionRepository.save(option);
  }

  // Delete an option by its ID
  async deleteOption(optionId: number): Promise<void> {
    const result = await this.optionRepository.delete(optionId);

    if (result.affected === 0) {
      throw new NotFoundException(`Option with ID ${optionId} not found`);
    }
  }

  // Get the correct option for a specific question
  async getCorrectOptionForQuestion(questionId: number): Promise<Option> {
    const correctOption = await this.optionRepository.findOne({
      where: {
        question: { id: questionId },
        isCorrect: true,
      },
    });

    if (!correctOption) {
      throw new NotFoundException(`No correct option found for question ID ${questionId}`);
    }

    return correctOption;
  }
}
