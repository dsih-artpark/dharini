import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BioWetland } from 'src/entities/bio-wetland.entity';
import { BioPoultryFarm } from 'src/entities/bio-poultry-farm.entity';
import { BioWaterBoundary } from 'src/entities/bio-water-boundary.entity';
import { BioCattleMarket } from 'src/entities/bio-cattle-market.entity';
import { Site } from 'src/entities/site.entity';
import { Disease } from 'src/entities/disease.entity';
import { Project } from 'src/entities/project.entity';
import { GeoLensController } from './geolens.controller';
import { GeoLensService } from './geolens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BioWetland,
      BioPoultryFarm,
      BioWaterBoundary,
      BioCattleMarket,
      Site,
      Disease,
      Project,
    ]),
  ],
  controllers: [GeoLensController],
  providers: [GeoLensService],
  exports: [GeoLensService],
})
export class GeoLensModule {}
