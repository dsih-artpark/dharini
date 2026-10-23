import { Module } from '@nestjs/common';
import { KitService } from './kit.service';
import { KitController } from './kit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kit } from 'src/entities/kit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kit])],
  controllers: [KitController],
  providers: [KitService],
})
export class KitModule {}
