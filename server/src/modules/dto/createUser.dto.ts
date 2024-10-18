import { IsEmail, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcryptjs';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'please enter the name' })
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'please enter email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter password' })
  password: string;

  @IsNotEmpty()
  @IsIn(['user', 'admin'])
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
