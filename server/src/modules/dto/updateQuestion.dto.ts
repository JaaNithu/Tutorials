import { IsOptional, IsString, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from 'class-transformer';
import { UpdateOptionDto } from './updateOption.dto';

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    question: string;

    @IsOptional()
    @IsNumber()
    sectionId: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateOptionDto)
    options?: UpdateOptionDto[];
}
