import { IsEmail, IsEnum, IsNotEmpty, Length, Matches } from "class-validator";
import { MESSAGES, RULE } from "src/app.util";
export enum UserRole {
    ADMIN = 1,
    USER = 0,
    GUEST = 2,
}

export class UserRegisterRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 20)
    @Matches(RULE, {
        message: MESSAGES,
    })
    password: string;

    @IsNotEmpty()
    @Length(8, 20)
    @Matches(RULE, {
        message: MESSAGES,
      })
    confirm: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}