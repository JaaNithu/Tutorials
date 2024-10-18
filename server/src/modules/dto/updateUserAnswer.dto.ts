import { IsNotEmpty, Length, IsOptional } from "class-validator";

export class UpdateUserAnswerDto {
    @IsOptional()
    userId?: number;

    @IsOptional()
    questionId?: number;

    @IsOptional()
    @Length(1, 500)
    answerText?: string;
}
