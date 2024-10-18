import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'please enter email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter password' })
  password: string;
}
