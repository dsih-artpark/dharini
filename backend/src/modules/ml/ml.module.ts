import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MlController } from './ml.controller';
import { MlService } from './ml.service';

@Module({
  imports: [HttpModule],
  controllers: [MlController],
  providers: [MlService],
})
export class MlModule {}
