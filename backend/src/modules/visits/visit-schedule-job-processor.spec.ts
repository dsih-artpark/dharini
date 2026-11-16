import { CronJobProcessor } from './visit-schedule-job-processor';
import { VisitStatus } from '../../common/enums/visitStatus.enum';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';

/**
 * These tests pin the behaviour that the scheduling cron must create a visit for
 * EVERY due site on each run (it previously used `.getOne()` and only ever
 * scheduled one site per day, starving every other site), and that it must not
 * duplicate a visit for a site that already has an upcoming one.
 */
describe('CronJobProcessor.process', () => {
  let processor: CronJobProcessor;
  let siteRepository: any;
  let visitRepository: any;
  let userRepository: any;
  let teamRepository: any;
  let collector: any;
  let collectorQueries: any[];
  let dueSites: any[];

  const makeSite = (id: string) => ({
    id,
    project: { id: 'p1' },
    collectorIds: ['c1', 'c2'],
    collectionStartDate: new Date('2026-05-22T00:00:00Z'),
    collectionLastScheduleDate: new Date('2026-06-12T00:00:00Z'),
    collectionFrequencyInterval: 7,
  });

  const makeQueryBuilder = () => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(dueSites),
    getOne: jest.fn().mockResolvedValue(dueSites[0] ?? null),
  });

  beforeEach(() => {
    dueSites = [makeSite('s1'), makeSite('s2'), makeSite('s3')];
    siteRepository = {
      createQueryBuilder: jest.fn(() => makeQueryBuilder()),
      save: jest.fn().mockResolvedValue(undefined),
    };
    visitRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((v) => v),
      save: jest.fn().mockResolvedValue(undefined),
    };
    // loadProjectCollector's user query and the project's teams (t1).
    collector = { id: 'c1', team: { id: 't1' }, roles: [] };
    collectorQueries = [];
    userRepository = {
      manager: {
        createQueryBuilder: jest.fn((entity: unknown) => {
          const qb: any = {
            leftJoinAndSelect: () => qb,
            innerJoin: () => qb,
            select: () => qb,
            where: (_sql: string, params: any) => {
              if (entity === User) collectorQueries.push(params);
              return qb;
            },
            getOne: async () => collector,
            getRawMany: async () => (entity === Team ? [{ id: 't1' }] : []),
          };
          return qb;
        }),
      },
    };
    teamRepository = {};

    processor = new CronJobProcessor(
      siteRepository,
      visitRepository,
      userRepository,
      teamRepository,
    );
  });

  it('creates a visit and advances the pointer for EVERY due site', async () => {
    await processor.process();

    expect(visitRepository.save).toHaveBeenCalledTimes(3);
    expect(siteRepository.save).toHaveBeenCalledTimes(3);
  });

  it('skips a site that already has an upcoming visit', async () => {
    // s1 already has an upcoming visit; s2 and s3 do not.
    visitRepository.findOne
      .mockResolvedValueOnce({ id: 'existing-upcoming' })
      .mockResolvedValue(null);

    await processor.process();

    expect(visitRepository.save).toHaveBeenCalledTimes(2);
    expect(siteRepository.save).toHaveBeenCalledTimes(2);
  });

  it('gives the visit to the primary collector and their team', async () => {
    await processor.process();

    expect(collectorQueries[0]).toEqual({ userId: 'c1' });
    expect(visitRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collector: expect.objectContaining({ id: 'c1' }),
        team: { id: 't1' },
      }),
    );
  });

  it('uses the collector’s team in the site’s project, not their own team from another project', async () => {
    collector = {
      id: 'c1',
      team: { id: 't-other-project' },
      roles: [{ status: 'active', team: 't1', project: 'p1' }],
    };

    await processor.process();

    expect(visitRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ team: { id: 't1' } }),
    );
  });

  it.each([
    ['no longer exists', null],
    ['is in none of the project’s teams', { id: 'c1', team: null, roles: [] }],
  ])(
    'schedules nothing and keeps the site’s schedule when its collector %s',
    async (_label, missing) => {
      collector = missing;

      await processor.process();

      expect(visitRepository.save).not.toHaveBeenCalled();
      // The pointer stays, so the site is scheduled once its collector is fixed.
      expect(siteRepository.save).not.toHaveBeenCalled();
    },
  );

  it('only picks sites that have a collector', async () => {
    const builder = makeQueryBuilder();
    siteRepository.createQueryBuilder.mockReturnValue(builder);

    await processor.process();

    const conditions = builder.andWhere.mock.calls.map(([sql]) => String(sql));
    expect(
      conditions.some((sql) =>
        sql.includes('cardinality(site.collectorIds) > 0'),
      ),
    ).toBe(true);
  });

  it('looks for the existing visit by upcoming status', async () => {
    await processor.process();

    expect(visitRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visitStatus: VisitStatus.UPCOMING }),
      }),
    );
  });
});
