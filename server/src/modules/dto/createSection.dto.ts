import { IsNotEmpty, Length, IsUrl } from "class-validator";

export class CreateSectionDto {
  @IsNotEmpty({ message: 'The section should have a title' })
  @Length(1, 255)
  title: string;

  @IsNotEmpty({ message: 'The section should have a description' })
  @Length(1)
  description: string;

  @IsUrl({}, { message: 'The video URL must be a valid URL' })
  @Length(1, 255, { message: 'The video URL must be between 1 and 255 characters long' })
  video_url?: string;

  @IsNotEmpty({ message: 'The section should have an order' })
  section_order: number;

}
