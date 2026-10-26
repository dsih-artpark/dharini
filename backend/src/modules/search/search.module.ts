import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Site } from 'src/entities/site.entity';
import { Disease } from 'src/entities/disease.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Site, User, Disease])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
