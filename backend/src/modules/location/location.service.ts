import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { Location } from 'src/entities/location.entity';
import { ILike, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Region } from 'src/entities/region.entity';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}
  async findAll(query: any): Promise<Location[]> {
    const searchFields = [
      'lgdCode',
      'localName',
      // 'stateCode',
      'stateName',
      'districtName',
    ];
    const searchText = query.searchText ? `%${query.searchText}%` : null; // Wildcard search

    let whereCondition: any[] = [];

    if (searchText) {
      whereCondition = searchFields.map((field) => ({
        [field]: ILike(searchText),
        status: StatusType.ACTIVE,
      }));
    } else {
      whereCondition = [{ ...query, status: StatusType.ACTIVE }];
    }

    return this.locationRepository.find({
      where: whereCondition,
      relations: ['region'],
    });
  }

  async findOne(query: any): Promise<Location> {
    try {
      const role = await this.locationRepository.findOne({
        where: { ...query, status: StatusType.ACTIVE },
      });
      if (!role) {
        throw new NotFoundException(`Location with query ${query} not found`);
      }
      return role;
    } catch {
      throw new NotFoundException(`Location with ID ${query} not found`);
    }
  }

  async getLocationByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<Location | null> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where(
        `ST_DWithin(location.coordinates, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 100)`,
      )
      .setParameters({ latitude, longitude })
      .getOne();
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      // const existingLocation = await this.getLocationByCoordinates(createLocationDto.latitude, createLocationDto.longitude);
      // if (existingLocation) {
      //   return existingLocation;
      // }
      const geoJSON = {
        type: 'Point',
        coordinates: [createLocationDto.longitude, createLocationDto.latitude],
      };

      const regionId = await this.regionRepository.findOne({
        where: { id: createLocationDto.regionId },
      });
      if (!regionId) {
        throw new NotFoundException(
          `Region not found for regionId ${createLocationDto.regionId}`,
        );
      }
      const queryBuilder = this.locationRepository.createQueryBuilder();
      const result = await queryBuilder
        .insert()
        .into(Location)
        .values({
          ...createLocationDto,
          region: regionId,
          coordinates: () => `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
        })
        .returning('*')
        .execute();
      const locationData = result.raw[0] as Location;
      const createdLocation = await this.locationRepository.findOne({
        where: { id: locationData.id },
      });
      return createdLocation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error.message);
    }
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    try {
      const geoJSON = {
        type: 'Point',
        coordinates: [updateLocationDto.longitude, updateLocationDto.latitude],
      };

      const regionId = await this.regionRepository.findOne({
        where: { id: updateLocationDto.regionId },
      });
      const queryBuilder = this.locationRepository.createQueryBuilder();
      const result = await queryBuilder
        .update(Location)
        .set({
          // ...updateLocationDto,
          region: regionId,
          coordinates: () => `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
        })
        .where('id = :id', { id })
        .returning('*')
        .execute();
      const locationData = result.raw[0] as Location;

      return locationData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<Location> {
    const deleteDto = {
      status: StatusType.DELETED,
    };
    const site = await this.locationRepository.preload({
      id: id,
      ...deleteDto,
    });

    // If the site exists, update the existing site
    return await this.locationRepository.save(site);
  }

  async convertExcelToJson(buffer: Buffer) {
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

      // Transform JSON into the desired structure
      const results = [];
      const cities: any[] = [];

      jsonData.forEach((row: any) => {
        const stateName = row['State Name'];
        // const stateCode = row['State Code'];
        const district = {
          stateName,
          // stateCode,
          lgdCode: row['District LGD Code'],
          districtName: row['District Name (In English)'],
          localName: row['District Name (In Local language)'],
          shortDistrictName: row['Short Name of District'],
          census2001Code: row['Census 2001 Code'],
          census2011Code: row['Census2011 Code'],
        };

        let stateData = results.find((item) => item.stateName === stateName);

        if (!stateData) {
          stateData = {
            stateName,
            // stateCode,
            cities: [],
          };
          results.push(stateData);
        }

        cities.push({ ...district, metaData: district });
      });

      return await this.locationRepository.save(cities);
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }
}
