import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectLocationStateType } from 'src/common/dto/response/region.response';
import { RegionType } from 'src/common/enums/region.enum';
import { Scope } from 'src/common/enums/scope.enum';
import { getUserScope } from 'src/common/functions/get-user-role';
import { Project } from 'src/entities/project.entity';
import { Region } from 'src/entities/region.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);

    // If there's a parent region, fetch it and assign
    if (createRegionDto.parentId) {
      const parentRegion = await this.regionRepository.findOne({
        where: { id: createRegionDto.parentId },
      });
      if (createRegionDto.regionType !== RegionType.COUNTRY && !parentRegion) {
        throw new NotFoundException('Parent region not found');
      }
      region.parentRegion = parentRegion;
    }

    return this.regionRepository.save(region);
  }

  async findAll({ type, select, search }): Promise<Region[]> {
    try {
      const selectFields = select ? select.split(',') : [];
      const queryBuilder = this.regionRepository.createQueryBuilder('region');
      if (selectFields && selectFields.length > 0) {
        queryBuilder.select(selectFields.map((field) => `region.${field}`));
      }
      queryBuilder.where('region.regionType = :regionType', {
        regionType: type,
      });
      if (search) {
        queryBuilder.andWhere('region.name ILIKE :search', {
          search: `%${search}%`,
        });
      }
      queryBuilder.orderBy('region.name', 'ASC');
      return await queryBuilder.getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async findAllRegionsAvailableInProject(
    { search }: any,
    user,
  ): Promise<ProjectLocationStateType[]> {
    try {
      const userScope = getUserScope(user);
      const projectQueryBuilder = this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.regions', 'region')
        .leftJoin('project.createdBy', 'createdBy');

      // Super-admins (System scope) can see all projects - no createdBy filter
      if (userScope !== Scope.System) {
        projectQueryBuilder.where('project.id = :projectId', {
          projectId: user?.project?.id,
        });
      }

      const projectsRegions = await projectQueryBuilder.getMany();

      // Extract just region IDs
      const regionIds = projectsRegions
        .flatMap((project) => project.regions)
        .map((region) => region.id);

      const uniqueRegionIds = [...new Set(regionIds)];

      if (uniqueRegionIds.length === 0) {
        return [];
      }

      const queryBuilder = this.regionRepository.createQueryBuilder('region');
      queryBuilder.leftJoinAndSelect('region.parentRegion', 'parentRegion');

      queryBuilder.select([
        'parentRegion.id', // 👈 add any parent fields you need
        'parentRegion.name', // 👈 example: parent name
      ]);

      // if (selectFields && selectFields.length > 0) {
      //   queryBuilder.select(selectFields.map((field) => `region.${field}`));
      // }
      queryBuilder
        .where('region.regionType = :regionType', {
          regionType: 'district',
        })
        .andWhere('region.id IN (:...regionIds)', {
          regionIds: uniqueRegionIds,
        });

      queryBuilder.select([
        'parentRegion.id AS id',
        'parentRegion.regionType AS regionType',
        'parentRegion.lgdCode AS lgdCode',
        'parentRegion.localName AS localName',
        'parentRegion.name AS name',
        'parentRegion.createdAt AS createdAt',
        'parentRegion.updatedAt AS updatedAt',
      ]);
      if (search) {
        queryBuilder.andWhere('parentRegion.name ILIKE :search', {
          search: `%${search}%`,
        });
      }
      // queryBuilder.orderBy('region.name', 'ASC');
      queryBuilder.distinct(true);
      const regionsData = await queryBuilder.getRawMany();
      return regionsData;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionRepository.findOne({
      where: { id },
      relations: ['parentRegion', 'subRegions'],
    });

    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
    await this.regionRepository.update(id, updateRegionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const region = await this.findOne(id);
    await this.regionRepository.remove(region);
  }

  async findChildren(parentId: string): Promise<Region[]> {
    return this.regionRepository.find({
      where: { parentRegion: { id: parentId } },
    });
  }

  async validateRegionHierarchy(
    stateId: string,
    districtId: string,
  ): Promise<string> {
    const state = await this.regionRepository.findOne({
      where: { id: stateId },
      relations: ['subRegions'],
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    const districtExists = state.subRegions.some(
      (region) => region.id === districtId,
    );

    if (!districtExists) {
      throw new NotFoundException(
        'Selected district is not present in this state',
      );
    }

    return districtId;
  }

  async findAncestors(regionId: string): Promise<Region[]> {
    const region = await this.findOne(regionId);
    const ancestors: Region[] = [];
    let currentRegion = region.parentRegion;

    while (currentRegion) {
      ancestors.push(currentRegion);
      currentRegion = await this.regionRepository.findOne({
        where: { id: currentRegion.id },
        relations: ['parentRegion'],
      });
    }

    return ancestors;
  }

  async convertExcelToJsonState(buffer: Buffer) {
    try {
      // Read the Excel file with exceljs
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

      // Get the first worksheet
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('No worksheet found in the Excel file');
      }

      const pr = await this.regionRepository.findOneBy({
        id: 'country_1',
      });
      if (!pr) {
        throw new Error('Parent region not found in the database.');
      }

      // Get headers from first row
      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || '';
      });

      // Convert worksheet to JSON array
      const jsonData: Record<string, any>[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData: Record<string, any> = {};
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value;
        });
        jsonData.push(rowData);
      });

      for (const row of jsonData) {
        const stateEntity = new Region();
        stateEntity.name = String(row['State Name (In English)']);
        stateEntity.lgdCode = String(row['State LGD Code']);
        stateEntity.localName = String(row['State Name (In Local language)']);
        stateEntity.regionType = RegionType.STATE;
        stateEntity.id = `${RegionType.STATE}_${stateEntity.lgdCode}`;
        stateEntity.metaData = { ...stateEntity };
        stateEntity.parentRegion = pr;
        console.log('Before saving:', stateEntity);

        await this.regionRepository.upsert(stateEntity, [
          'regionType',
          'lgdCode',
          'parentRegion',
        ]);
      }

      console.log('All states saved successfully');

      return true;
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  async convertExcelToJsonDistrict(buffer: Buffer) {
    try {
      // Read the Excel file with exceljs
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

      // Get the first worksheet
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('No worksheet found in the Excel file');
      }

      // Get headers from first row
      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || '';
      });

      // Convert worksheet to JSON array
      const jsonData: Record<string, any>[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData: Record<string, any> = {};
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value;
        });
        jsonData.push(rowData);
      });

      for (const row of jsonData) {
        const stateName = String(row['State Name']).replace(
          /\s*\(State\)$/,
          '',
        ); // Clean state name
        const districtName = String(row['District Name (In English)']);
        const lgdCode = String(row['District LGD Code']);

        // Find the parent state
        const parentState = await this.regionRepository.findOne({
          where: { name: stateName, regionType: RegionType.STATE },
        });

        // If no parent state found, throw an error
        if (!parentState) {
          console.warn(
            `⚠️ Warning: No state found for district "${districtName}". Skipping...`,
          );
          continue;
        }

        // Create the district entity
        const districtEntity = new Region();
        districtEntity.name = districtName;
        districtEntity.localName = String(
          row['District Name (In Local language)'],
        );
        districtEntity.lgdCode = lgdCode;
        districtEntity.regionType = RegionType.DISTRICT;
        districtEntity.id = `${RegionType.DISTRICT}_${districtEntity.lgdCode}`;
        districtEntity.metaData = { ...districtEntity };
        districtEntity.parentRegion = parentState;
        console.log(
          `Saving district: ${districtName} under state: ${stateName}`,
        );

        await this.regionRepository.upsert(districtEntity, [
          'regionType',
          'lgdCode',
          'parentRegion',
        ]);
      }

      console.log('✅ All districts processed successfully');
      return true;
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }
}
