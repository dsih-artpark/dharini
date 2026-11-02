import { CronJobProcessor } from './visit-schedule-job-processor';
import { VisitStatus } from '../../common/enums/visitStatus.enum';

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
    userRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 'c1', team: { id: 't1' } }),
    };
    teamRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 't1' }),
    };

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

    expect(userRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'c1' } }),
    );
    expect(visitRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collector: { id: 'c1', team: { id: 't1' } },
        team: { id: 't1' },
      }),
    );
  });

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
