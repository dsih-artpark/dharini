import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { VisitSchedulerService } from './visit-scheduler.service';

configDotenv();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.QUEUE,
    }),
  ],
  providers: [VisitSchedulerService],
})
export class VisitSchedulerModule {}
