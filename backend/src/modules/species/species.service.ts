import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Species } from 'src/entities/species.entity';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    const species = this.speciesRepository.create(createSpeciesDto);
    return this.speciesRepository.save(species);
  }

  async findAll(): Promise<Species[]> {
    return this.speciesRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Species> {
    const species = await this.speciesRepository.findOne({ where: { id } });
    if (!species) {
      throw new NotFoundException(`Species with ID ${id} not found`);
    }
    return species;
  }

  async update(
    id: string,
    updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    const species = await this.findOne(id);
    Object.assign(species, updateSpeciesDto);
    return this.speciesRepository.save(species);
  }

  async remove(id: string): Promise<void> {
    const species = await this.findOne(id);
    await this.speciesRepository.remove(species);
  }
}
