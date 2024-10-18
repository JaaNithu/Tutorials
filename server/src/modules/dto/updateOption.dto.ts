import { IsNotEmpty, Length, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class UpdateOptionDto {
    @IsOptional()
    @IsNumber()
    optionId: number;

    @IsOptional()
    @Length(2, 255)
    text: string;

    @IsOptional()
    @IsNumber()
    questionId: number;

    @IsOptional()
    @IsBoolean()
    isCorrect: boolean;
}
