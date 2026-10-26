import { Injectable } from '@nestjs/common';
import { CreateKitDto } from './dto/create-kit.dto';
import { UpdateKitDto } from './dto/update-kit.dto';
import { StatusType } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kit } from 'src/entities/kit.entity';

@Injectable()
export class KitService {
  constructor(
    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,
  ) {}
  async create(createKitDto: CreateKitDto): Promise<Kit> {
    try {
      const user = await this.kitRepository.create(createKitDto);
      return await this.kitRepository.save(user);
    } catch (error) {
      console.log('Create kit error: ', error);
      throw error;
    }
  }

  async findAll(query: any) {
    try {
      return await await this.kitRepository.find({ where: query });
    } catch (error) {
      console.log('Find all kit error: ', error);
      throw error;
    }
  }

  async findOne(query: any) {
    try {
      return await this.kitRepository.findOne({
        where: query,
      });
    } catch (error) {
      console.log('Find one kit error: ', error);
      throw error;
    }
  }

  async update(id: string, updateKitDto: UpdateKitDto) {
    try {
      const kit = await this.kitRepository.findOne({
        where: {
          id,
        },
      });

      if (!kit) {
        // If the kit does not exist, create a new one
        const newKit = this.kitRepository.create({
          id,
          ...updateKitDto,
        });
        return this.kitRepository.save(newKit);
      }

      updateKitDto = Object.assign(kit, updateKitDto);

      // If the kit exists, update the existing kit
      await this.kitRepository.save(updateKitDto);

      return kit;
    } catch (error) {
      console.log('Update kit error: ', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const kit = await this.findOne(id);
      await this.update(kit.id, { status: StatusType.DELETED });
    } catch (error) {
      console.log('Remove kit error: ', error);
      throw error;
    }
  }
}
