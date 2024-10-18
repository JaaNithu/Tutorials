import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Section } from "./section.entity";
import { SectionRepository } from "./section.repository";
import { CreateSectionDto } from "../dto/createSection.dto";
import { UpdateSectionDto } from "../dto/updateSection.dto";

@Injectable()
export class SectionService {
    private sectionRepository: SectionRepository;

    constructor(private dataSource: DataSource) {
        this.sectionRepository = this.dataSource.getRepository(Section).extend(SectionRepository);
    }

    // Retrieve all sections with their associated questions and options
    async getAllSections(): Promise<Section[]> {
        return await this.sectionRepository.createQueryBuilder('q')
            .leftJoinAndSelect('q.questions', 'qt')
            .leftJoinAndSelect('qt.options', 'o')
            .getMany();
    }

    // Retrieve a section by its ID
    async getSectionById(id: number): Promise<Section> {
        const section = await this.sectionRepository.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });

        if (!section) {
            throw new NotFoundException(`Section with ID ${id} not found`);
        }

        return section;
    }

    // Create a new section
    async createNewSection(sectionDto: CreateSectionDto): Promise<Section> {
        const section = this.sectionRepository.create(sectionDto);
        return await this.sectionRepository.save(section);
    }

    // Update an existing section by its ID
    async updateSection(id: number, sectionDto: UpdateSectionDto): Promise<Section> {
        const section = await this.getSectionById(id);
        this.sectionRepository.merge(section, sectionDto);
        return await this.sectionRepository.save(section);
    }

    // Delete a section by its ID
    async deleteSection(id: number): Promise<void> {
        const section = await this.getSectionById(id);
        await this.sectionRepository.remove(section);
    }

    // Retrieve sections by specific criteria (e.g., name)
    async getSectionsByName(title: string): Promise<Section[]> {
        return await this.sectionRepository.find({
            where: { title },
            relations: ['questions', 'questions.options']
        });
    }
}
