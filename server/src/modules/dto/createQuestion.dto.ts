import { IsNotEmpty, IsString, Length, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './createOption.dto';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  question: string;

  @IsNotEmpty()
  @IsNumber()
  sectionId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
