import { Injectable } from '@nestjs/common';
import { CreateSampleTypeDto } from './dto/create-sample-type.dto';
import { UpdateSampleTypeDto } from './dto/update-sample-type.dto';
import { SampleType } from 'src/entities/sample-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';

import { SurveillanceType } from 'src/entities/surveillance-type.entity';

@Injectable()
export class SampleTypeService {
  constructor(
    @InjectRepository(SampleType)
    private readonly sampleTypeRepository: Repository<SampleType>,
    @InjectRepository(SurveillanceType)
    private readonly surveillanceTypeRepository: Repository<SurveillanceType>,
  ) {}
  async create(createSampleTypeDto: CreateSampleTypeDto): Promise<SampleType> {
    const { surveillanceType, ...rest } = createSampleTypeDto;

    const surveillanceTypeData = surveillanceType
      ? await this.surveillanceTypeRepository.findOne({
          where: { id: surveillanceType },
        })
      : null;

    const sampleType = this.sampleTypeRepository.create({
      ...rest,
      surveillanceType: surveillanceTypeData,
    });
    return await this.sampleTypeRepository.save(sampleType);
  }

  async findAll(query: any) {
    return await await this.sampleTypeRepository
      .createQueryBuilder('sampleType')
      .leftJoinAndSelect('sampleType.surveillanceType', 'surveillanceType')
      .where(query)
      .orderBy('sampleType.name', 'ASC')
      .getMany();
  }

  async findOne(query: any) {
    return await this.sampleTypeRepository
      .createQueryBuilder('sampleType')
      .leftJoinAndSelect('sampleType.surveillanceType', 'surveillanceType')
      .where(query)
      .getOne();
  }

  async update(id: string, updateSampleTypeDto: UpdateSampleTypeDto) {
    const sampleType = await this.sampleTypeRepository.findOne({
      where: {
        id,
      },
    });

    let surveillanceTypeData = null;
    if (updateSampleTypeDto.surveillanceType) {
      surveillanceTypeData = await this.surveillanceTypeRepository.findOne({
        where: {
          id: updateSampleTypeDto.surveillanceType,
        },
      });
    }

    if (!sampleType) {
      // If the sampleType does not exist, create a new one
      const newSampleType = this.sampleTypeRepository.create({
        id,
        ...updateSampleTypeDto,
        surveillanceType: surveillanceTypeData,
      });
      return this.sampleTypeRepository.save(newSampleType);
    }

    const { surveillanceType, ...rest } = updateSampleTypeDto;
    Object.assign(sampleType, rest);
    if (surveillanceType) {
      sampleType.surveillanceType = surveillanceTypeData;
    }

    // If the sampleType exists, update the existing sampleType
    await this.sampleTypeRepository.save(sampleType);

    return sampleType;
  }

  async remove(id: string) {
    const sampleType = await this.findOne(id);
    await this.update(sampleType.id, { status: StatusType.DELETED });
  }
}
