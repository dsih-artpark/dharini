import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon'; // Import Luxon DateTime class
import { Visit } from 'src/entities/visit.entity';
import { LessThan, Repository } from 'typeorm';

import { configDotenv } from 'dotenv';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { calculateNextCollectionDate } from 'src/common/functions/site-collection';
configDotenv();
@Processor(process.env.QUEUE)
export class CronJobProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {
    super();
  }

  getNextVisitDate(site: Site): DateTime | null {
    // Use the shared calculator with `forDisplay` so a stale/overdue pointer
    // advances to the next non-past occurrence instead of back-dating a visit.
    return calculateNextCollectionDate(site, true);
  }

  async process() {
    try {
      // Select EVERY site whose next scheduled visit is due (or overdue) today.
      // Previously this used `.getOne()`, so only a single site was ever served
      // per daily run and a daily-frequency site starved every other one.
      const dueSites = await this.siteRepository
        .createQueryBuilder('site')
        .leftJoinAndSelect('site.project', 'project')
        .leftJoinAndSelect('site.collectionCollector', 'collectionCollector')
        .where(
          `site.collectionLastScheduleDate IS NOT NULL AND
           DATE_TRUNC('day', CURRENT_TIMESTAMP) >=
           DATE_TRUNC('day', site.collectionLastScheduleDate + site.collectionFrequencyInterval * INTERVAL '1 day')`,
        )
        .andWhere(
          `site.collectionFrequencyInterval IS NOT NULL AND
         site.collectionFrequency IS NOT NULL AND
         site.collectionCollector IS NOT NULL AND
         site.collectionStartDate IS NOT NULL AND
         site.collectionDuration IS NOT NULL`,
        )
        .andWhere(
          `DATE_TRUNC('second', CURRENT_TIMESTAMP) <= DATE_TRUNC('second', site.collectionExpiryDate)`,
        )
        .getMany();

      for (const site of dueSites) {
        // Process each site independently so one failure can't block the rest.
        try {
          // Skip if the site still has an open (upcoming) visit, to avoid
          // creating a duplicate.
          const existingUpcoming = await this.visitRepository.findOne({
            where: {
              site: { id: site.id },
              visitStatus: VisitStatus.UPCOMING,
              isCompleted: false,
            },
          });
          if (existingUpcoming) {
            continue;
          }

          const scheduledDate = this.getNextVisitDate(site);
          if (!scheduledDate) {
            // Misconfigured collection plan (e.g. a zero/absent frequency
            // interval). Skip rather than crash the whole run.
            console.warn(
              `Skipping site ${site.id}: cannot compute a next collection date ` +
                `(collectionFrequencyInterval=${site.collectionFrequencyInterval}).`,
            );
            continue;
          }

          if (
            site.collectionExpiryDate &&
            scheduledDate.toJSDate() > new Date(site.collectionExpiryDate)
          ) {
            continue;
          }

          await this.createNewVisit(site, scheduledDate.toJSDate());

          site.collectionLastScheduleDate = scheduledDate.toJSDate();
          await this.siteRepository.save(site);
        } catch (error) {
          console.error(`Failed to schedule visit for site ${site.id}:`, error);
        }
      }

      // await this.markOneOverdueVisit();
    } catch (error) {
      console.log(error);
    }
  }

  async markOneOverdueVisit(): Promise<void> {
    const currentDate = new Date();
    // Find one visit where visitScheduleDateTime is in the past and visitStatus is not OVERDUE
    const overdueVisit = await this.visitRepository.findOne({
      where: {
        isCompleted: false,
        visitScheduledAt: LessThan(currentDate),
        visitStatus: VisitStatus.UPCOMING,
      },
    });

    if (overdueVisit) {
      // Update the status to OVERDUE
      overdueVisit.visitStatus = VisitStatus.OVERDUE;
      await this.visitRepository.save(overdueVisit);

      console.log(`Visit with ID ${overdueVisit.id} marked as OVERDUE.`);
    } else {
      console.log('No overdue visit found.');
    }
  }

  async createNewVisit(collectionPlan, visitScheduleDateTime) {
    try {
      const userData = await this.userRepository.findOne({
        where: { id: collectionPlan?.collectionCollector?.id },
        relations: ['team'],
      });
      const teamData = await this.teamRepository.findOne({
        where: { id: userData?.team?.id },
      });
      const visit = this.visitRepository.create({
        site: collectionPlan,
        collector: collectionPlan.collectionCollector,
        team: teamData,
        project: collectionPlan.project,
        questionSetId: 'qs-1',
        visitScheduledAt: DateTime.fromJSDate(visitScheduleDateTime, {
          zone: 'utc',
        }).toISO(), // Store as ISO string
      });

      await this.visitRepository.save(visit);
    } catch (error) {
      throw error;
    }
  }
}
