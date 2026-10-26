import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveillanceTypeDto } from './dto/create-surveillance-type.dto';
import { UpdateSurveillanceTypeDto } from './dto/update-surveillance-type.dto';
import { StatusType } from '../../common/enums/status.enum';

import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SurveillanceTypeService {
  constructor(
    @InjectRepository(SurveillanceType)
    private readonly surveillanceTypeRepository: Repository<SurveillanceType>,
  ) {}

  async findAll(query: any): Promise<SurveillanceType[]> {
    return this.surveillanceTypeRepository.find({ where: query });
  }

  async findOne(query: any): Promise<SurveillanceType> {
    try {
      const surveillanceType = await this.surveillanceTypeRepository.findOne({
        where: query,
      });
      if (!surveillanceType) {
        throw new NotFoundException(
          `SurveillanceType with query ${query} not found`,
        );
      }
      return surveillanceType;
    } catch (error) {
      throw new NotFoundException(
        `SurveillanceType with ID ${query} not found`,
      );
    }
  }

  async create(
    createSurveillanceTypeDto: CreateSurveillanceTypeDto,
  ): Promise<SurveillanceType> {
    try {
      console.log('createSurveillanceTypeDto', createSurveillanceTypeDto);
      const surveillanceType = await this.surveillanceTypeRepository.create(
        createSurveillanceTypeDto,
      );

      console.log('surveillanceType', surveillanceType);
      return await this.surveillanceTypeRepository.save(surveillanceType);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSurveillanceTypeDto: UpdateSurveillanceTypeDto,
  ): Promise<SurveillanceType> {
    const surveillanceType = await this.surveillanceTypeRepository.preload({
      id: id,
      ...updateSurveillanceTypeDto,
    });

    if (!surveillanceType) {
      // If the surveillanceType does not exist, create a new one
      const newSurveillanceType = this.surveillanceTypeRepository.create({
        id,
        ...updateSurveillanceTypeDto,
      });
      return this.surveillanceTypeRepository.save(newSurveillanceType);
    }

    // If the surveillanceType exists, update the existing surveillanceType
    await this.surveillanceTypeRepository.save(surveillanceType);

    return surveillanceType;
  }

  async remove(id: string): Promise<any> {
    const deleteDto = {
      status: StatusType.DELETED,
    };
    const surveillanceType = await this.surveillanceTypeRepository.preload({
      id: id,
      ...deleteDto,
    });

    // If the surveillanceType exists, update the existing surveillanceType
    return await this.surveillanceTypeRepository.save(surveillanceType);
  }
}
