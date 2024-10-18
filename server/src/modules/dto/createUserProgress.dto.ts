import { IsBoolean, IsDate, IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserProgressDto {
    @IsBoolean()
    isCompleted: boolean;
  
    @IsDate()
    completionDate: Date;
  
    @IsInt()
    @IsNotEmpty()
    userId: number;
  
    @IsInt()
    @IsNotEmpty()
    sectionId: number;
}
