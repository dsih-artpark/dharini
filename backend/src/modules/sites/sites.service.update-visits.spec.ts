import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { SitesService } from './sites.service';

/**
 * The apps send a site's whole plan with every save. A save whose dates are
 * the same keeps the site's visits - and their ids, which a phone may hold
 * offline and submit to later - handing the open ones to a new primary
 * collector in place. Only a save with new dates makes them again.
 */
describe('SitesService.update - a saved plan’s visits', () => {
  const DAY = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - 7 * DAY);
  const expiry = new Date(start.getTime() + 90 * DAY);

  const storedSite = () =>
    ({
      id: 's1',
      name: 'Farm',
      project: { id: 'p1' },
      location: { id: 'l1' },
      photos: [],
      collectorIds: ['u1', 'u2'],
      collectionStartDate: start,
      collectionExpiryDate: expiry,
      collectionFrequencyInterval: 7,
      collectionDayOfWeek: ['Monday'],
      collectionDuration: 90,
    }) as unknown as Site;

  // `left` names users who have since left the project's teams.
  const build = ({ left = [] as string[] } = {}) => {
    const user = (id: string) => ({
      id,
      status: 'active',
      team: { id: left.includes(id) ? 't9' : 't1' },
      roles: [],
    });
    // validateSiteCollectors' lookups: the users asked for, and the
    // project's team t1.
    const lookupBuilder = (entity: unknown) => {
      let ids: string[] = [];
      const qb: any = {
        leftJoinAndSelect: () => qb,
        innerJoin: () => qb,
        select: () => qb,
        where: (_sql: string, params?: { ids?: string[] }) => {
          if (params?.ids) ids = params.ids;
          return qb;
        },
        getMany: async () => (entity === User ? ids.map(user) : []),
        getRawMany: async () => (entity === Team ? [{ id: 't1' }] : []),
      };
      return qb;
    };
    // loadProjectCollector's lookups of one collector and the project's teams.
    const collectorBuilder = (entity: unknown) => {
      let userId: string | undefined;
      const qb: any = {
        leftJoinAndSelect: () => qb,
        innerJoin: () => qb,
        select: () => qb,
        where: (_sql: string, params?: { userId?: string }) => {
          userId = params?.userId ?? userId;
          return qb;
        },
        getOne: async () => (userId ? user(userId) : null),
        getRawMany: async () => (entity === Team ? [{ id: 't1' }] : []),
      };
      return qb;
    };

    let savedCollectorIds: string[] | undefined;
    const tx: any = {
      createQueryBuilder: jest.fn((entity?: unknown) => {
        if (entity === User || entity === Team) return collectorBuilder(entity);
        const qb: any = {
          update: () => qb,
          set: (values: any) => {
            savedCollectorIds = values.collectorIds ?? savedCollectorIds;
            return qb;
          },
          where: () => qb,
          returning: () => qb,
          execute: async () => ({ raw: [{ id: 's1' }] }),
        };
        return qb;
      }),
      findOne: jest.fn(async () => ({
        ...storedSite(),
        collectorIds: savedCollectorIds ?? storedSite().collectorIds,
      })),
      find: jest.fn(async () => []),
    };

    const columns = [
      'name',
      'collectorIds',
      'collectionStartDate',
      'collectionExpiryDate',
      'collectionFrequencyInterval',
      'collectionDayOfWeek',
      'collectionDuration',
      'collectionFrequency',
      'updatedBy',
      'location',
    ];
    const siteRepository: any = {
      findOne: jest.fn(async () => storedSite()),
      createQueryBuilder: jest.fn(() => {
        const qb: any = {
          innerJoinAndSelect: () => qb,
          where: () => qb,
          andWhere: () => qb,
          getOne: async () => null,
        };
        return qb;
      }),
      metadata: {
        columns: columns.map((propertyName) => ({ propertyName })),
        relations: [],
      },
      manager: {
        createQueryBuilder: jest.fn(lookupBuilder),
        transaction: jest.fn(async (work: (m: any) => unknown) => work(tx)),
      },
    };

    const service = new SitesService(
      {} as any, // mediaService
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      siteRepository,
      {} as any, // visitRepository
      {} as any, // mediaRepository
      {} as any, // diseaseRepository
      {} as any, // sampleRepository
      {} as any, // projectRepository
      {} as any, // userRepository
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );
    const replace = jest
      .spyOn(service as any, 'replaceUpcomingVisits')
      .mockResolvedValue(undefined);
    const reassign = jest
      .spyOn(service as any, 'reassignOpenVisits')
      .mockResolvedValue(undefined);
    const generate = jest
      .spyOn(service, 'generateAllVisitsForSite')
      .mockResolvedValue(undefined);
    return { service, replace, reassign, generate };
  };

  // As the collection-plan forms send it: the whole plan, every time.
  const save = (
    service: SitesService,
    collectorIds: string[],
    plan: { collectionFrequencyInterval?: number } = {},
  ) =>
    service.update(
      's1',
      collectorIds,
      {
        collectionFrequency: 1,
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Monday'],
        collectionDuration: 90,
        ...plan,
      },
      { collectionStartDate: start, collectionExpiryDate: expiry } as any,
      { id: 'admin' } as User,
      undefined,
      'p1',
    );

  it('keeps the visits when the same plan is saved with another collector added', async () => {
    const { service, replace, reassign, generate } = build();

    await save(service, ['u1', 'u2', 'u3']);

    expect(replace).not.toHaveBeenCalled();
    expect(reassign).not.toHaveBeenCalled();
    // Only dates without a visit get one.
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 's1' }),
      expect.objectContaining({ onlyFuture: true }),
    );
  });

  it('hands the open visits to a new primary collector in place when the dates are the same', async () => {
    const { service, replace, reassign } = build();

    await save(service, ['u2', 'u1']);

    expect(replace).not.toHaveBeenCalled();
    expect(reassign).toHaveBeenCalledWith(expect.anything(), 's1', 'u2', 'p1');
  });

  it('makes the visits again when the dates change, then hands the kept ones to a new primary', async () => {
    const { service, replace, reassign, generate } = build();

    await save(service, ['u2', 'u1'], { collectionFrequencyInterval: 14 });

    expect(replace).toHaveBeenCalledTimes(1);
    expect(reassign).toHaveBeenCalledWith(expect.anything(), 's1', 'u2', 'p1');
    expect(generate).not.toHaveBeenCalled();
    expect(replace.mock.invocationCallOrder[0]).toBeLessThan(
      reassign.mock.invocationCallOrder[0],
    );
  });

  it('refuses new dates, rather than deleting the visits with nothing in their place, when the first collector has left the project’s teams', async () => {
    // u1 stays first, so isn't checked again when the collectors are saved.
    const { service, replace } = build({ left: ['u1'] });

    await expect(
      save(service, ['u1', 'u2'], { collectionFrequencyInterval: 14 }),
    ).rejects.toThrow(/no longer in any of the project’s teams/);
    expect(replace).not.toHaveBeenCalled();
  });

  it('still saves the same dates when the first collector has left, keeping the visits', async () => {
    const { service, replace } = build({ left: ['u1'] });

    await expect(save(service, ['u1', 'u2', 'u3'])).resolves.toBeDefined();
    expect(replace).not.toHaveBeenCalled();
  });
});
