import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import { RegionService } from '../region/region.service';
import { Region } from 'src/entities/region.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Region, Project, User])],
  controllers: [LocationController],
  providers: [LocationService, RegionService],
})
export class LocationModule {}
