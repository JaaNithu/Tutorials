import { IsNotEmpty, Length } from "class-validator";

export class CreateUserAnswerDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    questionId: number;

    @IsNotEmpty()
    @Length(1, 500)
    answerText: string;
}
