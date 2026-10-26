import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { SitesService } from './sites.service';

/**
 * Every site gets a visit on its collection start date, even when that isn't a
 * preferred collection day, without duplicating a visit that already exists on
 * that date or moving collectionLastScheduleDate off the plan's last date.
 */
describe('SitesService.generateAllVisitsForSite', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';

  const makeService = (existingVisits: Partial<Visit>[] = []) => {
    const manager = {
      find: jest.fn().mockResolvedValue(existingVisits),
      findOne: jest.fn().mockResolvedValue({ id: 'u1', team: { id: 't1' } }),
      save: jest.fn(),
      update: jest.fn(),
    };
    const deps = {
      siteRepository: {
        manager: {
          transaction: jest.fn(async (work: (m: any) => unknown) =>
            work(manager),
          ),
        },
      },
      visitRepository: {
        create: jest.fn((visit: Partial<Visit>) => visit),
      },
      userRepository: {},
    };

    const service = new SitesService(
      {} as any, // mediaService
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      deps.siteRepository as any,
      deps.visitRepository as any,
      {} as any, // mediaRepository
      {} as any, // diseaseRepository
      {} as any, // sampleRepository
      {} as any, // projectRepository
      deps.userRepository as any,
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );

    return { service, manager };
  };

  // As node-postgres returns the `timestamp without time zone` columns: the
  // stored wall-clock time in the server's local zone. Saturday 2026-10-10,
  // weekly on Mondays, for 30 days.
  const saturdayStartSite = () =>
    ({
      id: SITE_ID,
      collectionStartDate: new Date(2026, 9, 10),
      collectionExpiryDate: new Date(2026, 10, 9, 23, 59, 59),
      collectionFrequencyInterval: 7,
      collectionDuration: 30,
      collectionDayOfWeek: ['Monday'],
      collectionCollector: { id: 'u1' },
      project: { id: 'P4TOD6' },
    }) as unknown as Site;

  const savedDates = (manager: { save: jest.Mock }) =>
    (manager.save.mock.calls[0]?.[1] ?? []).map((v: Visit) =>
      v.visitScheduledAt.toISOString().slice(0, 10),
    );

  it('creates the start-date visit before the scheduled Mondays', async () => {
    const { service, manager } = makeService();

    await service.generateAllVisitsForSite(saturdayStartSite());

    expect(savedDates(manager)).toEqual([
      '2026-10-10',
      '2026-10-12',
      '2026-10-19',
      '2026-10-26',
      '2026-11-02',
      '2026-11-09',
    ]);
    expect(manager.update).toHaveBeenCalledWith(Site, SITE_ID, {
      collectionLastScheduleDate: new Date('2026-11-09T00:00:00.000Z'),
    });
  });

  it('does not create a second visit when one already exists on the start date', async () => {
    const { service, manager } = makeService([
      {
        id: 'v-start',
        visitScheduledAt: new Date('2026-10-10T00:00:00.000Z'),
        rescheduledFrom: null,
      },
    ]);

    await service.generateAllVisitsForSite(saturdayStartSite());

    expect(savedDates(manager)).toEqual([
      '2026-10-12',
      '2026-10-19',
      '2026-10-26',
      '2026-11-02',
      '2026-11-09',
    ]);
    expect(manager.update).toHaveBeenCalledWith(Site, SITE_ID, {
      collectionLastScheduleDate: new Date('2026-11-09T00:00:00.000Z'),
    });
  });

  it('gives a replaced day a visit again beside a kept one, and skips the other kept days', async () => {
    const { service, manager } = makeService([
      {
        id: 'v-completed',
        visitScheduledAt: new Date('2026-10-12T00:00:00.000Z'),
        rescheduledFrom: null,
      },
      {
        id: 'v-rescheduled',
        visitScheduledAt: new Date('2026-10-27T00:00:00.000Z'),
        rescheduledFrom: new Date('2026-10-19T00:00:00.000Z'),
      },
    ]);

    await service.generateAllVisitsForSite(saturdayStartSite(), {
      // The day's own plan visit was deleted to be made again.
      replacing: [
        new Date('2026-10-12T00:00:00.000Z'),
        new Date('2026-10-12T00:00:00.000Z'),
      ],
    });

    // 12 Oct once, beside the completed visit; 19 Oct was moved to 27 Oct.
    expect(savedDates(manager)).toEqual([
      '2026-10-10',
      '2026-10-12',
      '2026-10-26',
      '2026-11-02',
      '2026-11-09',
    ]);
  });
});
