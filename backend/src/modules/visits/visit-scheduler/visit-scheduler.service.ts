import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { configDotenv } from 'dotenv';

configDotenv();

@Injectable()
export class VisitSchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue(process.env.QUEUE)
    private readonly visitSchedulerQueue: Queue,
  ) {}

  async onModuleInit() {
    console.log('Initializing Visit Scheduler…');

    await this.visitSchedulerQueue.upsertJobScheduler(
      process.env.JOB_SCHEDULER,
      {
        pattern: process.env.JOB_SCHEDULE_REPEAT_PATTERN,
      },
    );

    console.log('Visit scheduler registered.');
  }
}
