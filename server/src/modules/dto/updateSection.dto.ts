import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSectionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    video_url?: string;

    @IsOptional()
    section_order?: number;

    @IsOptional()
    isActive?: boolean;
}
