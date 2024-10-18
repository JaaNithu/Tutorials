import { IsNumber, IsString } from 'class-validator';

export class QuestionResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    question: string;

    @IsNumber()
    sectionId: number;

}
