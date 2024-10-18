import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from '../dto/createSection.dto';
import { UpdateSectionDto } from '../dto/updateSection.dto';
import { Section } from './section.entity';

@Controller('section')
export class SectionController {
    constructor(private sectionService: SectionService) {}

    // Get all sections
    @Get('/')
    async getAllSections(): Promise<Section[]> {
        return await this.sectionService.getAllSections();
    }

    // Get a section by ID
    @Get('/:id')
    async getSectionById(@Param('id', ParseIntPipe) id: number): Promise<Section> {
        return await this.sectionService.getSectionById(id);
    }

    // Create a new section
    @Post('/create')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createSection(@Body() sectionData: CreateSectionDto): Promise<Section> {
        return await this.sectionService.createNewSection(sectionData);
    }

    // Update an existing section
    @Put('/:id')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async updateSection(
        @Param('id', ParseIntPipe) id: number,
        @Body() sectionData: UpdateSectionDto,
    ): Promise<Section> {
        return await this.sectionService.updateSection(id,  sectionData);

    }

    // Delete a section
    @Delete('delete/:id')
    @HttpCode(204) // No Content response
    async deleteSection(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.sectionService.deleteSection(id);
    }

    // Get sections by title
    @Get('/by-title')
    async getSectionsByTitle(@Query('title') title: string): Promise<Section[]> {
        return await this.sectionService.getSectionsByName(title);
    }
}
