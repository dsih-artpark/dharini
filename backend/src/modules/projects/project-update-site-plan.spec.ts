import { HttpException } from '@nestjs/common';
import { DateTime, Settings } from 'luxon';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { SitesService } from '../sites/sites.service';
import { ProjectsController } from './projects.controller';

/**
 * Collection plan edits, from the request body the apps send through
 * ProjectsController.updateSite and SitesService.update, with only the
 * repositories mocked. An edit that moves the plan's dates is scheduled anew
 * from its start date, past dates included, in place of the site's untouched
 * upcoming and overdue visits and around the visits it keeps; one that would
 * leave no upcoming visit is refused before anything is written.
 */
describe('Editing a collection plan', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const PROJECT_ID = 'P4TOD6';

  const originalNow = Settings.now;
  afterEach(() => {
    Settings.now = originalNow;
  });
  const setClock = (iso: string) => {
    const millis = DateTime.fromISO(iso).toMillis();
    Settings.now = () => millis;
  };

  // node-postgres reads `timestamp without time zone` columns back as the
  // stored wall-clock time in the server's local zone.
  const stored = (sql: string) => DateTime.fromSQL(sql).toJSDate();
  const utcDay = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`);

  const storedSite = (plan: Partial<Site>) =>
    ({
      id: SITE_ID,
      name: 'Hebbal Farm',
      photos: null,
      project: { id: PROJECT_ID },
      location: { id: 'loc-1' },
      collectionCollector: { id: 'u1' },
      collectionFrequency: 1,
      collectionTime: '09:00:00',
      ...plan,
    }) as unknown as Site;

  // Weekly on Mondays from Mon 7 Sep 2026 for 120 days, so until 5 Jan 2027.
  const activeWeeklyMondays = () =>
    storedSite({
      collectionStartDate: stored('2026-09-07 00:00:00'),
      collectionExpiryDate: stored('2027-01-05 23:59:59'),
      collectionFrequencyInterval: 7,
      collectionDayOfWeek: ['Monday'] as any,
      collectionDuration: 120,
    });

  // A site saved without a plan.
  const planlessSite = () =>
    storedSite({
      collectionStartDate: null,
      collectionExpiryDate: null,
      collectionFrequencyInterval: null,
      collectionDayOfWeek: null,
      collectionDuration: null,
    });

  // The example plan: from Thu 1 Jan 2026 for 30 days, edited on 1 Mar, more
  // than a month after it started.
  const endedPlan = (interval: number) =>
    storedSite({
      collectionStartDate: stored('2026-01-01 00:00:00'),
      collectionExpiryDate: stored('2026-01-31 23:59:59'),
      collectionFrequencyInterval: interval,
      collectionDayOfWeek: ['Monday'] as any,
      collectionDuration: 30,
    });

  // Every mobile save carries the site details, location and collector;
  // plan fields only when the plan changed. It never sends a start date.
  const mobileBody = (plan: Record<string, unknown> = {}) => ({
    name: 'Hebbal Farm',
    address: '1 Farm Road',
    regionId: 'district_572',
    latitude: 13.04,
    longitude: 77.59,
    collectionCollector: 'u1',
    ...plan,
  });
  const mobilePlan = (interval: number, days: string[], duration: number) =>
    mobileBody({
      collectionFrequencyInterval: interval,
      collectionFrequency: 1,
      collectionDayOfWeek: days,
      collectionTime: '09:00:00',
      collectionDuration: duration,
    });

  // The web form sends the whole plan, start date included.
  const webPlan = (
    collectionStartDate: string,
    collectionDayOfWeek = ['Monday'],
    collectionDuration = 60,
  ) => ({
    collectionCollector: 'u1',
    collectionFrequency: 1,
    collectionFrequencyInterval: 7,
    collectionDuration,
    collectionDayOfWeek,
    collectionTime: '09:00',
    collectionStartDate,
  });

  // A query builder that records its calls and returns itself. A delete
  // returns the rows it removed.
  const queryBuilder = (deleted: Partial<Visit>[] = []) => {
    const calls: Array<{ method: string; args: any[] }> = [];
    const builder: any = new Proxy(
      {},
      {
        get(_, method: string) {
          if (method === 'then') return undefined;
          if (method === 'calls') return calls;
          return (...args: any[]) => {
            calls.push({ method, args });
            if (method === 'execute') {
              if (calls.some((c) => c.method === 'delete')) {
                return Promise.resolve({
                  raw: deleted,
                  affected: deleted.length,
                });
              }
              return Promise.resolve({ raw: [{ id: SITE_ID }], affected: 0 });
            }
            if (method === 'getOne') return Promise.resolve(null);
            return builder;
          };
        },
      },
    );
    return builder;
  };
  const argsOf = (builder: any, method: string) =>
    builder.calls.filter((c) => c.method === method).map((c) => c.args);

  // The site row as the UPDATE leaves it, read back the way node-postgres does.
  const applyUpdate = (site: Site, set: Record<string, any>) => {
    const row: Record<string, any> = { ...site };
    for (const [key, value] of Object.entries(set)) {
      if (typeof value === 'function') {
        // collectionDayOfWeek goes in as raw ARRAY[...] SQL.
        row[key] = [...String(value()).matchAll(/'(\w+)'::/g)].map((m) => m[1]);
      } else if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
      ) {
        row[key] = stored(value);
      } else {
        row[key] = value;
      }
    }
    return row as Site;
  };

  const editPlan = async (
    site: Site,
    body: Record<string, unknown>,
    {
      visits = [] as Partial<Visit>[],
      deleted = [] as Partial<Visit>[],
      failSave = false,
    } = {},
  ) => {
    const managerQueries: any[] = [];
    const manager = {
      createQueryBuilder: jest.fn(() => {
        const builder = queryBuilder(deleted);
        managerQueries.push(builder);
        return builder;
      }),
      findOne: jest.fn(async (entity: unknown) => {
        if (entity !== Site) return { id: 'u1', team: { id: 't1' } };
        const update = managerQueries.find((q) => argsOf(q, 'update').length);
        const row = applyUpdate(site, argsOf(update, 'set')[0][0]);
        // The collector the relation query last set, if any.
        const [assigned] = managerQueries
          .filter((q) => argsOf(q, 'relation').length)
          .flatMap((q) => argsOf(q, 'set').map(([user]) => user))
          .filter(Boolean)
          .reverse();
        return assigned ? { ...row, collectionCollector: assigned } : row;
      }),
      // The visits left once the replaceable ones are deleted.
      find: jest.fn().mockResolvedValue(visits),
      save: jest.fn<Promise<void>, any[]>(async () => {
        if (failSave) throw new Error('insert failed');
      }),
      update: jest.fn(),
    };
    const siteRepository = {
      findOne: jest.fn().mockResolvedValue(site),
      createQueryBuilder: jest.fn(() => queryBuilder()),
      metadata: {
        columns: [
          'name',
          'address',
          'collectionFrequencyInterval',
          'collectionFrequency',
          'collectionDayOfWeek',
          'collectionTime',
          'collectionStartDate',
          'collectionLastScheduleDate',
          'collectionDuration',
          'collectionExpiryDate',
        ].map((propertyName) => ({ propertyName })),
        relations: ['collectionCollector', 'updatedBy', 'location'].map(
          (propertyName) => ({ propertyName }),
        ),
      },
      manager: {
        transaction: jest.fn(async (work: (m: any) => unknown) =>
          work(manager),
        ),
      },
    };
    const locationService = {
      update: jest.fn().mockResolvedValue({ id: 'loc-1' }),
    };
    const userRepository = {
      findOne: jest.fn(async ({ where }) => ({ id: where.id })),
    };

    const siteService = new SitesService(
      {} as any, // mediaService
      {} as any, // userService
      locationService as any,
      {} as any, // regionService
      {} as any, // process
      siteRepository as any,
      { create: jest.fn((visit: Partial<Visit>) => visit) } as any,
      {} as any, // mediaRepository
      {} as any, // diseaseRepository
      {} as any, // sampleRepository
      {} as any, // projectRepository
      userRepository as any,
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );

    const request = ProjectsController.prototype.updateSite.call(
      { siteService, userRepository },
      PROJECT_ID,
      SITE_ID,
      body,
      { user: { id: 'u1' } },
    );

    const siteUpdate = () =>
      managerQueries.find((q) => argsOf(q, 'update').length);
    const visitDelete = () =>
      managerQueries.find((q) => argsOf(q, 'delete').length);
    const visitReassign = () =>
      managerQueries.find((q) =>
        argsOf(q, 'update').some(([entity]) => entity === Visit),
      );
    const createdVisits = (): Visit[] => manager.save.mock.calls[0]?.[1] ?? [];
    const createdDates = (): string[] =>
      createdVisits().map((v: Visit) =>
        v.visitScheduledAt.toISOString().slice(0, 10),
      );

    return {
      request,
      manager,
      siteRepository,
      locationService,
      siteUpdate,
      setFields: () => argsOf(siteUpdate(), 'set')[0][0],
      visitDelete,
      deleteConditions: (): string[] =>
        [
          ...argsOf(visitDelete(), 'where'),
          ...argsOf(visitDelete(), 'andWhere'),
        ].map(([sql]) => String(sql)),
      visitReassign,
      reassignConditions: (): string[] =>
        [
          ...argsOf(visitReassign(), 'where'),
          ...argsOf(visitReassign(), 'andWhere'),
        ].map(([sql]) => String(sql)),
      createdVisits,
      createdDates,
    };
  };

  const expectRefused = async (
    edit: Awaited<ReturnType<typeof editPlan>>,
    message: string,
  ) => {
    const error = await edit.request.catch((e) => e);
    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(400);
    expect(error.message).toBe(message);
    // Refused before anything was written.
    expect(edit.siteRepository.manager.transaction).not.toHaveBeenCalled();
    expect(edit.locationService.update).not.toHaveBeenCalled();
    expect(edit.manager.createQueryBuilder).not.toHaveBeenCalled();
    expect(edit.manager.save).not.toHaveBeenCalled();
  };

  // An edited plan is scheduled anew: the delete takes the old plan's
  // untouched upcoming and overdue visits at any date, and keeps the rest.
  const expectsWholePlanReplaced = (
    edit: Awaited<ReturnType<typeof editPlan>>,
  ) => {
    const conditions = edit.deleteConditions();
    expect(conditions).toContain('"siteId" = :siteId');
    // Upcoming and overdue, whichever is stored: completed and skipped
    // visits stay.
    expect(conditions).toContain('"visitStatus" IN (:...statuses)');
    expect(argsOf(edit.visitDelete(), 'andWhere')[0][1]).toEqual({
      statuses: ['upcoming', 'overdue'],
    });
    expect(conditions).toContain('"isCompleted" = false');
    // Rescheduled visits stay.
    expect(conditions).toContain('"rescheduledFrom" IS NULL');
    // No date limit, so past (overdue) visits go too.
    expect(conditions.some((sql) => sql.includes('visitScheduledAt'))).toBe(
      false,
    );
    // Started visits, and visits with samples, animal metadata or lab
    // tests, stay.
    const untouched = conditions.find((sql) => sql.includes('NOT EXISTS'));
    for (const guard of [
      '"visitStartedAt" IS NULL',
      '"visitedAt" IS NULL',
      'FROM "samples"',
      'FROM "animal_metadata"',
      'FROM "lab_tests"',
    ]) {
      expect(untouched).toContain(guard);
    }
  };

  describe('an active plan', () => {
    beforeEach(() => setClock('2026-10-12T05:30:00.000Z')); // Mon 12 Oct, 11:00 IST

    it('schedules a plan moved from Mondays to Tuesdays anew from its start date', async () => {
      const edit = await editPlan(
        activeWeeklyMondays(),
        mobilePlan(7, ['Tuesday'], 120),
        // A visit rescheduled from Mon 19 Oct to Tue 20 Oct survives the delete.
        {
          visits: [
            {
              visitScheduledAt: utcDay('2026-10-20'),
              rescheduledFrom: utcDay('2026-10-19'),
            },
          ],
        },
      );
      await edit.request;

      // The start date and plan end stay; only the day changes.
      expect(edit.setFields().collectionStartDate).toBeUndefined();
      expect(edit.setFields().collectionExpiryDate).toBe('2027-01-05 23:59:59');
      // The 7 Sep start, then every Tuesday; the past ones are overdue.
      expect(edit.createdDates()).toEqual([
        '2026-09-07',
        '2026-09-08',
        '2026-09-15',
        '2026-09-22',
        '2026-09-29',
        '2026-10-06',
        '2026-10-13',
        // 20 Oct already has the kept rescheduled visit.
        '2026-10-27',
        '2026-11-03',
        '2026-11-10',
        '2026-11-17',
        '2026-11-24',
        '2026-12-01',
        '2026-12-08',
        '2026-12-15',
        '2026-12-22',
        '2026-12-29',
        '2027-01-05',
      ]);
    });

    it('moves a monthly plan to fortnightly', async () => {
      const edit = await editPlan(
        storedSite({
          ...activeWeeklyMondays(),
          collectionFrequencyInterval: 30,
        }),
        mobilePlan(14, ['Monday'], 120),
      );
      await edit.request;

      expect(edit.setFields().collectionFrequencyInterval).toBe(14);
      // Every other Monday from the 7 Sep start until 5 Jan.
      expect(edit.createdDates()).toEqual([
        '2026-09-07',
        '2026-09-21',
        '2026-10-05',
        '2026-10-19',
        '2026-11-02',
        '2026-11-16',
        '2026-11-30',
        '2026-12-14',
        '2026-12-28',
      ]);
    });

    it('deletes the untouched upcoming and overdue visits of the old plan', async () => {
      const edit = await editPlan(
        activeWeeklyMondays(),
        mobilePlan(7, ['Tuesday'], 120),
      );
      await edit.request;

      expectsWholePlanReplaced(edit);
    });

    it('still only replaces upcoming visits when a save leaves the dates alone', async () => {
      // A new collector on an unchanged plan: overdue visits stay, and dates
      // a kept visit already has are skipped, as before.
      const edit = await editPlan(
        activeWeeklyMondays(),
        mobileBody({ collectionCollector: 'u2' }),
        {
          visits: [
            {
              visitScheduledAt: utcDay('2026-10-20'),
              rescheduledFrom: utcDay('2026-10-19'),
            },
          ],
        },
      );
      await edit.request;

      const conditions = edit.deleteConditions();
      expect(conditions).toContain('"visitStatus" = :status');
      expect(argsOf(edit.visitDelete(), 'andWhere')[0][1]).toEqual({
        status: 'upcoming',
      });
      expect(conditions).toContain('"isCompleted" = false');
      expect(conditions).toContain('"rescheduledFrom" IS NULL');
      // From today on: overdue (past) visits stay.
      expect(conditions).toContain('"visitScheduledAt" >= :todayStart');
      const [, { todayStart }] = argsOf(edit.visitDelete(), 'andWhere').find(
        ([sql]) => sql.includes('todayStart'),
      );
      expect(todayStart.toISOString()).toBe('2026-10-12T00:00:00.000Z');
      const dates = edit.createdDates();
      expect(dates[0]).toBe('2026-10-12');
      // 19 Oct was rescheduled away.
      expect(dates[1]).toBe('2026-10-26');
      expect(dates[dates.length - 1]).toBe('2027-01-04');
    });

    it('writes the site, the visit delete and the new visits in one transaction', async () => {
      const edit = await editPlan(
        activeWeeklyMondays(),
        mobilePlan(7, ['Tuesday'], 120),
        { failSave: true },
      );

      // A failed insert fails the request, and the transaction it ran in
      // undoes the site update and the delete with it.
      await expect(edit.request).rejects.toThrow('insert failed');
      expect(edit.siteRepository.manager.transaction).toHaveBeenCalledTimes(1);
      expect(edit.siteUpdate()).toBeDefined();
      expect(edit.visitDelete()).toBeDefined();
      // Outside the transaction only the duplicate-name lookup runs.
      expect(edit.siteRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });

    it('keeps the stored duration when an older app build sends 0', async () => {
      const edit = await editPlan(
        activeWeeklyMondays(),
        mobilePlan(7, ['Tuesday'], 0),
      );
      await edit.request;

      expect(edit.setFields()).not.toHaveProperty('collectionDuration');
      expect(edit.setFields()).not.toHaveProperty('collectionExpiryDate');
      // Scheduled from the 7 Sep start against the stored 5 Jan 2027 end.
      const dates = edit.createdDates();
      expect(dates[0]).toBe('2026-09-07');
      expect(dates[dates.length - 1]).toBe('2027-01-05');
    });

    it('refuses a shorter duration that ends the plan before today', async () => {
      // Wednesdays from 1 Jul for 180 days (to 28 Dec), cut to 90 days.
      const site = storedSite({
        collectionStartDate: stored('2026-07-01 00:00:00'),
        collectionExpiryDate: stored('2026-12-28 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Wednesday'] as any,
        collectionDuration: 180,
      });

      await expectRefused(
        await editPlan(site, mobilePlan(7, ['Wednesday'], 90)),
        'The updated collection plan ends on 29 Sep 2026, before today, so it would have no upcoming visits. Choose a new start date or a longer duration.',
      );
    });

    it('refuses turning it into a one-time collection on its past start week', async () => {
      // Once collects on the first chosen day from the start date, and the
      // mobile app can't send a new start date.
      await expectRefused(
        await editPlan(activeWeeklyMondays(), mobilePlan(0, ['Monday'], 0)),
        'The one-time collection date, 7 Sep 2026, is before today, so it would have no upcoming visit. Choose a new start date.',
      );
    });

    it('turns it into a one-time collection on a new start date', async () => {
      // The web form sends a start date. The old plan's expiry (31 Jul) would
      // fall before the one-time date, so it is cleared, as one-time plans
      // are created without one.
      const site = storedSite({
        collectionStartDate: stored('2026-07-01 00:00:00'),
        collectionExpiryDate: stored('2026-07-31 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Wednesday'] as any,
        collectionDuration: 30,
      });
      const edit = await editPlan(site, {
        collectionCollector: 'u1',
        collectionFrequency: 1,
        collectionFrequencyInterval: 0,
        collectionDuration: 0,
        collectionDayOfWeek: ['Wednesday'],
        collectionTime: '09:00',
        collectionStartDate: '2026-10-14',
      });
      await edit.request;

      expect(edit.setFields().collectionStartDate).toBe('2026-10-14 00:00:00');
      expect(edit.setFields().collectionExpiryDate).toBeNull();
      expect(edit.createdDates()).toEqual(['2026-10-14']);
    });
  });

  describe('an edit that moves the start date', () => {
    beforeEach(() => setClock('2026-10-12T05:30:00.000Z')); // Mon 12 Oct, 11:00 IST

    // Weekly on Mondays from Mon 28 Sep for 60 days, so until 27 Nov.
    const fromLateSeptember = () =>
      storedSite({
        collectionStartDate: stored('2026-09-28 00:00:00'),
        collectionExpiryDate: stored('2026-11-27 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Monday'] as any,
        collectionDuration: 60,
      });

    it('schedules every date from the new start that no kept visit holds', async () => {
      const edit = await editPlan(fromLateSeptember(), webPlan('2026-09-14'), {
        visits: [
          // The visits the delete keeps: completed, skipped, rescheduled and
          // started.
          {
            visitScheduledAt: utcDay('2026-09-21'),
            isCompleted: true,
            visitStatus: 'completed' as any,
          },
          {
            visitScheduledAt: utcDay('2026-09-28'),
            visitStatus: 'skipped' as any,
          },
          {
            visitScheduledAt: utcDay('2026-10-07'),
            rescheduledFrom: utcDay('2026-10-05'),
          },
          {
            visitScheduledAt: utcDay('2026-10-12'),
            visitStartedAt: new Date('2026-10-12T04:00:00.000Z'),
          },
          {
            visitScheduledAt: utcDay('2026-10-20'),
            rescheduledFrom: utcDay('2026-10-19'),
          },
        ],
      });
      await edit.request;

      expect(edit.setFields().collectionStartDate).toBe('2026-09-14 00:00:00');
      expect(edit.setFields().collectionExpiryDate).toBe('2026-11-13 23:59:59');
      // Mondays from 14 Sep to 13 Nov, but not the completed 21 Sep, the
      // skipped 28 Sep, the started 12 Oct, or 5 and 19 Oct, which the
      // rescheduled visits were moved from.
      expect(edit.createdDates()).toEqual([
        '2026-09-14',
        '2026-10-26',
        '2026-11-02',
        '2026-11-09',
      ]);
    });

    it('keeps a skipped visit as it is, and adds no visit on its day', async () => {
      const skipped: Partial<Visit> = {
        id: 'v-skipped',
        visitScheduledAt: utcDay('2026-09-28'),
        isCompleted: false,
        visitStatus: 'skipped' as any,
        collector: { id: 'u1' } as any,
      };
      const skippedBefore = structuredClone(skipped);

      const edit = await editPlan(fromLateSeptember(), webPlan('2026-09-14'), {
        visits: [skipped],
      });
      await edit.request;

      // The delete takes only upcoming and overdue visits.
      expectsWholePlanReplaced(edit);
      expect(edit.createdDates()).toEqual([
        '2026-09-14',
        '2026-09-21',
        '2026-10-05',
        '2026-10-12',
        '2026-10-19',
        '2026-10-26',
        '2026-11-02',
        '2026-11-09',
      ]);
      // Neither saved nor updated.
      expect(skipped).toEqual(skippedBefore);
      expect(edit.createdVisits()).not.toContain(skipped);
      expect(edit.manager.save).toHaveBeenCalledTimes(1);
    });

    it('deletes the untouched upcoming and overdue visits of the old plan', async () => {
      const edit = await editPlan(fromLateSeptember(), webPlan('2026-09-14'));
      await edit.request;

      expectsWholePlanReplaced(edit);
    });

    it('adds no second set of visits when the new plan is saved again', async () => {
      // The plan as the edit above saved it, sent back unchanged: its overdue
      // visits stay, and only its upcoming ones are replaced.
      const saved = storedSite({
        collectionStartDate: stored('2026-09-14 00:00:00'),
        collectionExpiryDate: stored('2026-11-13 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Monday'] as any,
        collectionDuration: 60,
      });
      const edit = await editPlan(saved, webPlan('2026-09-14'), {
        visits: ['2026-09-14', '2026-09-21', '2026-09-28', '2026-10-05'].map(
          (day) => ({ visitScheduledAt: utcDay(day) }),
        ),
      });
      await edit.request;

      expect(edit.deleteConditions()).toContain(
        '"visitScheduledAt" >= :todayStart',
      );
      expect(edit.createdDates()).toEqual([
        '2026-10-12',
        '2026-10-19',
        '2026-10-26',
        '2026-11-02',
        '2026-11-09',
      ]);
    });

    it('schedules from a later start date', async () => {
      const edit = await editPlan(fromLateSeptember(), webPlan('2026-10-05'));
      await edit.request;

      expect(edit.setFields().collectionStartDate).toBe('2026-10-05 00:00:00');
      const dates = edit.createdDates();
      expect(dates[0]).toBe('2026-10-05');
      expect(dates[dates.length - 1]).toBe('2026-11-30');
    });

    it('refuses a new start more than a month back', async () => {
      await expectRefused(
        await editPlan(fromLateSeptember(), webPlan('2026-09-10')),
        'The new collection start date, 10 Sep 2026, is more than one month in the past. Choose a later start date.',
      );
    });

    it('keeps an unchanged start older than a month, and schedules anew from it', async () => {
      // The web form sends the saved 7 Sep start back with the days changed.
      const edit = await editPlan(
        activeWeeklyMondays(),
        webPlan('2026-09-07', ['Tuesday'], 120),
      );
      const response = await edit.request;

      expect(response.success).toBe(true);
      const dates = edit.createdDates();
      // The 7 Sep start, then Tuesdays until 5 Jan.
      expect(dates.slice(0, 3)).toEqual([
        '2026-09-07',
        '2026-09-08',
        '2026-09-15',
      ]);
      expect(dates[dates.length - 1]).toBe('2027-01-05');
    });
  });

  // Until 7 Oct 2026 the controller counted a plan's expiry from the day it
  // was saved, not from its start date. The web form sends the whole plan on
  // every save, and the expiry recounted from the start must not read as a
  // new plan.
  describe('a plan whose stored expiry was counted from the day it was saved', () => {
    // Weekly on Mondays from Mon 7 Sep for 120 days, saved on Tue 22 Sep, so
    // it ends on 20 Jan rather than 5 Jan.
    const legacyWeeklyMondays = () =>
      storedSite({
        collectionStartDate: stored('2026-09-07 00:00:00'),
        collectionExpiryDate: stored('2027-01-20 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Monday'] as any,
        collectionDuration: 120,
      });

    beforeEach(() => setClock('2026-10-12T05:30:00.000Z')); // Mon 12 Oct, 11:00 IST

    it('only reassigns upcoming visits when the web form changes the collector', async () => {
      const edit = await editPlan(
        legacyWeeklyMondays(),
        {
          ...webPlan('2026-09-07', ['Monday'], 120),
          collectionCollector: 'u2',
        },
        {
          visits: [
            {
              visitScheduledAt: utcDay('2026-10-20'),
              rescheduledFrom: utcDay('2026-10-19'),
            },
          ],
        },
      );
      const response = await edit.request;

      expect(response.success).toBe(true);
      // The stored 20 Jan end stays.
      expect(edit.setFields()).not.toHaveProperty('collectionExpiryDate');
      // Only untouched upcoming visits from today go; overdue ones stay.
      const conditions = edit.deleteConditions();
      expect(conditions).toContain('"visitStatus" = :status');
      expect(conditions).toContain('"visitScheduledAt" >= :todayStart');
      // From today, against the stored end, around the kept rescheduled
      // visit.
      const dates = edit.createdDates();
      expect(dates[0]).toBe('2026-10-12');
      expect(dates).not.toContain('2026-10-19');
      expect(dates[dates.length - 1]).toBe('2027-01-18');
    });

    it('is saved, not refused, when the recounted expiry would have ended the plan', async () => {
      // Weekly on Mondays from Mon 2 Feb for 30 days, saved on Mon 2 Mar:
      // stored to end on 1 Apr, but 4 Mar counted from its start.
      setClock('2026-03-16T05:30:00.000Z'); // Mon 16 Mar, 11:00 IST
      const site = storedSite({
        collectionStartDate: stored('2026-02-02 00:00:00'),
        collectionExpiryDate: stored('2026-04-01 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Monday'] as any,
        collectionDuration: 30,
      });

      const edit = await editPlan(site, {
        ...webPlan('2026-02-02', ['Monday'], 30),
        collectionCollector: 'u2',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields()).not.toHaveProperty('collectionExpiryDate');
      expect(edit.deleteConditions()).toContain(
        '"visitScheduledAt" >= :todayStart',
      );
      expect(edit.createdDates()).toEqual([
        '2026-03-16',
        '2026-03-23',
        '2026-03-30',
      ]);
    });

    it('still schedules a real change anew, against the recounted expiry', async () => {
      const edit = await editPlan(
        legacyWeeklyMondays(),
        webPlan('2026-09-07', ['Tuesday'], 120),
      );
      await edit.request;

      expect(edit.setFields().collectionExpiryDate).toBe('2027-01-05 23:59:59');
      expectsWholePlanReplaced(edit);
      const dates = edit.createdDates();
      expect(dates.slice(0, 2)).toEqual(['2026-09-07', '2026-09-08']);
      expect(dates[dates.length - 1]).toBe('2027-01-05');
    });
  });

  // Plan edits used to give a moved start day a visit even beside a kept one,
  // so a day can hold a completed visit and the plan's own upcoming one. A
  // save that only changes the collector hands the plan's visit over too.
  describe('changing only the collector', () => {
    beforeEach(() => setClock('2026-10-19T05:30:00.000Z')); // Mon 19 Oct, 11:00 IST

    // Weekly on Wednesdays from Mon 19 Oct for 30 days, so until 18 Nov.
    const fromMonday19Oct = () =>
      storedSite({
        collectionStartDate: stored('2026-10-19 00:00:00'),
        collectionExpiryDate: stored('2026-11-18 23:59:59'),
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Wednesday'] as any,
        collectionDuration: 30,
      });
    const toNewCollector = () => ({
      ...webPlan('2026-10-19', ['Wednesday'], 30),
      collectionCollector: 'u2',
    });
    const planVisitsFrom19Oct = [
      '2026-10-19',
      '2026-10-21',
      '2026-10-28',
      '2026-11-04',
      '2026-11-11',
      '2026-11-18',
    ];

    it('gives the new collector the plan visit that shares its day with a completed one', async () => {
      const completed: Partial<Visit> = {
        id: 'v-completed',
        visitScheduledAt: utcDay('2026-10-19'),
        isCompleted: true,
        visitStatus: 'completed' as any,
        collector: { id: 'u1' } as any,
      };
      const completedBefore = structuredClone(completed);

      const edit = await editPlan(fromMonday19Oct(), toNewCollector(), {
        visits: [completed],
        // The plan's own 19 Oct visit goes with the other untouched ones.
        deleted: planVisitsFrom19Oct.map((day) => ({
          visitScheduledAt: utcDay(day),
        })),
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      // Every deleted plan visit is made again for the new collector,
      // 19 Oct included.
      expect(edit.createdDates()).toEqual(planVisitsFrom19Oct);
      expect(edit.createdVisits().map((visit) => visit.collector?.id)).toEqual(
        planVisitsFrom19Oct.map(() => 'u2'),
      );
      // The completed visit stays as it was: it is neither deleted, saved
      // nor updated.
      expect(completed).toEqual(completedBefore);
      expect(edit.createdVisits()).not.toContain(completed);
      expect(edit.manager.save).toHaveBeenCalledTimes(1);
      expect(edit.manager.update.mock.calls).toEqual([
        [Site, SITE_ID, { collectionLastScheduleDate: utcDay('2026-11-18') }],
      ]);
    });

    it('still deletes only untouched upcoming visits from today on', async () => {
      const edit = await editPlan(fromMonday19Oct(), toNewCollector());
      await edit.request;

      const conditions = edit.deleteConditions();
      expect(conditions).toContain('"visitStatus" = :status');
      expect(argsOf(edit.visitDelete(), 'andWhere')[0][1]).toEqual({
        status: 'upcoming',
      });
      expect(conditions).toContain('"isCompleted" = false');
      expect(conditions).toContain('"rescheduledFrom" IS NULL');
      expect(conditions).toContain('"visitScheduledAt" >= :todayStart');
      const untouched = conditions.find((sql) => sql.includes('NOT EXISTS'));
      for (const guard of [
        '"visitStartedAt" IS NULL',
        '"visitedAt" IS NULL',
        'FROM "samples"',
        'FROM "animal_metadata"',
        'FROM "lab_tests"',
      ]) {
        expect(untouched).toContain(guard);
      }
      // The delete reports the days it emptied, for their visits to be made
      // again.
      expect(argsOf(edit.visitDelete(), 'returning')).toEqual([
        [['visitScheduledAt']],
      ]);
    });

    it('adds no visit beside a kept one on a day it deleted nothing from', async () => {
      // 19 Oct was collected with no separate plan visit, and the 28 Oct
      // visit was moved to 29 Oct: neither day gets a new visit.
      const edit = await editPlan(fromMonday19Oct(), toNewCollector(), {
        visits: [
          {
            id: 'v-completed',
            visitScheduledAt: utcDay('2026-10-19'),
            isCompleted: true,
            visitStatus: 'completed' as any,
          },
          {
            id: 'v-rescheduled',
            visitScheduledAt: utcDay('2026-10-29'),
            rescheduledFrom: utcDay('2026-10-28'),
          },
        ],
        deleted: ['2026-10-21', '2026-11-04', '2026-11-11', '2026-11-18'].map(
          (day) => ({ visitScheduledAt: utcDay(day) }),
        ),
      });
      await edit.request;

      expect(edit.createdDates()).toEqual([
        '2026-10-21',
        '2026-11-04',
        '2026-11-11',
        '2026-11-18',
      ]);
    });

    it('makes one visit for a day even when two were deleted from it', async () => {
      const edit = await editPlan(fromMonday19Oct(), toNewCollector(), {
        visits: [
          {
            id: 'v-completed',
            visitScheduledAt: utcDay('2026-10-19'),
            isCompleted: true,
            visitStatus: 'completed' as any,
          },
        ],
        deleted: [
          '2026-10-19',
          '2026-10-19',
          ...planVisitsFrom19Oct.slice(1),
        ].map((day) => ({ visitScheduledAt: utcDay(day) })),
      });
      await edit.request;

      expect(edit.createdDates()).toEqual(planVisitsFrom19Oct);
    });

    // The overdue visits the save keeps would otherwise still name the old
    // collector, beside upcoming ones made again for the new one.
    const expectsOpenVisitsReassigned = (
      edit: Awaited<ReturnType<typeof editPlan>>,
    ) => {
      const reassign = edit.visitReassign();
      expect(reassign).toBeDefined();
      // The new collector, with their team.
      expect(argsOf(reassign, 'set')[0][0]).toEqual({
        collector: { id: 'u2' },
        team: { id: 't1' },
      });
      const conditions = edit.reassignConditions();
      expect(conditions).toContain('"siteId" = :siteId');
      // Open visits, upcoming or overdue whichever is stored; completed and
      // skipped ones stay.
      expect(conditions).toContain('"visitStatus" IN (:...statuses)');
      expect(argsOf(reassign, 'andWhere')[0][1]).toEqual({
        statuses: ['upcoming', 'overdue'],
      });
      expect(conditions).toContain('"isCompleted" = false');
      // Rescheduled visits stay with their collector.
      expect(conditions).toContain('"rescheduledFrom" IS NULL');
      // No date limit, so overdue (past) visits move too.
      expect(conditions.some((sql) => sql.includes('visitScheduledAt'))).toBe(
        false,
      );
      // Started visits, and visits with samples, animal metadata or lab
      // tests, stay.
      const untouched = conditions.find((sql) => sql.includes('NOT EXISTS'));
      for (const guard of [
        '"visitStartedAt" IS NULL',
        '"visitedAt" IS NULL',
        'FROM "samples"',
        'FROM "animal_metadata"',
        'FROM "lab_tests"',
      ]) {
        expect(untouched).toContain(guard);
      }
    };

    it("hands the old collector's untouched overdue visits to the new one", async () => {
      const edit = await editPlan(fromMonday19Oct(), toNewCollector());
      const response = await edit.request;

      expect(response.success).toBe(true);
      expectsOpenVisitsReassigned(edit);
    });

    it('hands over the overdue visits of a plan that has ended', async () => {
      // No visit is made again for an ended plan, but its overdue ones
      // still move to the new collector.
      setClock('2026-03-01T05:30:00.000Z'); // Sun 1 Mar, 11:00 IST
      const edit = await editPlan(
        endedPlan(7),
        mobileBody({ collectionCollector: 'u2' }),
      );
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.visitDelete()).toBeUndefined();
      expect(edit.manager.save).not.toHaveBeenCalled();
      expectsOpenVisitsReassigned(edit);
    });

    it('leaves the visits alone when the collector stays the same', async () => {
      const edit = await editPlan(
        fromMonday19Oct(),
        webPlan('2026-10-19', ['Wednesday'], 30),
      );
      await edit.request;

      expect(edit.visitReassign()).toBeUndefined();
    });
  });

  describe('a first plan', () => {
    beforeEach(() => setClock('2026-10-12T05:30:00.000Z')); // Mon 12 Oct, 11:00 IST

    // Monthly on the 2nd Monday from Thu 10 Sep for 90 days, so until 9 Dec.
    const septemberPlan = (duration = 90) => ({
      collectionCollector: 'u1',
      collectionFrequency: 1,
      collectionFrequencyInterval: 30,
      collectionDuration: duration,
      collectionDayOfWeek: ['Monday'],
      collectionTime: '09:00',
      collectionStartDate: '2026-09-10',
    });

    it('schedules every date from its past start date, overdue ones included', async () => {
      const edit = await editPlan(planlessSite(), septemberPlan());
      await edit.request;

      expect(edit.setFields().collectionStartDate).toBe('2026-09-10 00:00:00');
      expect(edit.createdDates()).toEqual([
        '2026-09-10',
        '2026-09-14',
        '2026-10-12',
        '2026-11-09',
      ]);
    });

    it('is refused when it moves an existing plan back more than a month', async () => {
      // 10 Sep is before the earliest date, 12 Sep, by more than the margin.
      await expectRefused(
        await editPlan(activeWeeklyMondays(), septemberPlan()),
        'The new collection start date, 10 Sep 2026, is more than one month in the past. Choose a later start date.',
      );
    });

    it('is refused when it ended before today', async () => {
      await expectRefused(
        await editPlan(planlessSite(), septemberPlan(14)),
        'The updated collection plan ends on 24 Sep 2026, before today, so it would have no upcoming visits. Choose a new start date or a longer duration.',
      );
    });
  });

  describe('a plan starting within the past month', () => {
    beforeEach(() => setClock('2026-10-14T05:30:00.000Z')); // Wed 14 Oct, 11:00 IST

    // The three cases the apps allow with no upcoming visit.
    it('saves a one-time collection on a past start date, as an overdue visit', async () => {
      // Sunday 4 Oct, ten days back.
      const edit = await editPlan(planlessSite(), {
        collectionCollector: 'u1',
        collectionFrequency: 1,
        collectionFrequencyInterval: 0,
        collectionDuration: 0,
        collectionDayOfWeek: ['Sunday'],
        collectionTime: '09:00',
        collectionStartDate: '2026-10-04',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().collectionStartDate).toBe('2026-10-04 00:00:00');
      expect(edit.createdDates()).toEqual(['2026-10-04']);
    });

    it('saves a weekly Monday plan for one month from the earliest date', async () => {
      // 14 Sep to 14 Oct: its Mondays so far are all past.
      const edit = await editPlan(planlessSite(), {
        collectionCollector: 'u1',
        collectionFrequency: 1,
        collectionFrequencyInterval: 7,
        collectionDuration: 30,
        collectionDayOfWeek: ['Monday'],
        collectionTime: '09:00',
        collectionStartDate: '2026-09-14',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().collectionExpiryDate).toBe('2026-10-14 23:59:59');
      expect(edit.createdDates()).toEqual([
        '2026-09-14',
        '2026-09-21',
        '2026-09-28',
        '2026-10-05',
        '2026-10-12',
      ]);
    });

    it('saves a daily plan for one month from the earliest date of a 31-day month', async () => {
      // Today 14 Aug; 14 Jul to 13 Aug, all past.
      setClock('2026-08-14T05:30:00.000Z');
      const edit = await editPlan(planlessSite(), {
        collectionCollector: 'u1',
        collectionFrequency: 1,
        collectionFrequencyInterval: 1,
        collectionDuration: 30,
        collectionDayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        collectionTime: '09:00',
        collectionStartDate: '2026-07-14',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().collectionExpiryDate).toBe('2026-08-13 23:59:59');
      const dates = edit.createdDates();
      expect(dates).toHaveLength(31);
      expect(dates[0]).toBe('2026-07-14');
      expect(dates[30]).toBe('2026-08-13');
    });

    it('refuses a start older than the past month, even with no upcoming visit', async () => {
      // 12 Sep is before the earliest date, 14 Sep, by more than the margin.
      await expectRefused(
        await editPlan(planlessSite(), {
          collectionCollector: 'u1',
          collectionFrequency: 1,
          collectionFrequencyInterval: 0,
          collectionDuration: 0,
          collectionDayOfWeek: ['Saturday'],
          collectionTime: '09:00',
          collectionStartDate: '2026-09-12',
        }),
        'The one-time collection date, 12 Sep 2026, is before today, so it would have no upcoming visit. Choose a new start date.',
      );
    });

    it('keeps refusing an edit that moves an older plan to no upcoming visit', async () => {
      // The active plan started 7 Sep, outside the window. A duration cut to
      // 30 days leaves it no upcoming visit, and a new start date is needed.
      await expectRefused(
        await editPlan(activeWeeklyMondays(), mobilePlan(7, ['Monday'], 30)),
        'The updated collection plan ends on 7 Oct 2026, before today, so it would have no upcoming visits. Choose a new start date or a longer duration.',
      );
    });

    it('saves an edit that moves an existing plan to a start in the window with no upcoming visit', async () => {
      // A moved start date is scheduled from the new start, as a first plan
      // is, so the plan's past Mondays become overdue visits.
      const edit = await editPlan(activeWeeklyMondays(), {
        ...mobilePlan(7, ['Monday'], 30),
        collectionStartDate: '2026-09-14',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().collectionStartDate).toBe('2026-09-14 00:00:00');
      expect(edit.setFields().collectionExpiryDate).toBe('2026-10-14 23:59:59');
      expect(edit.visitDelete()).toBeDefined();
      expect(edit.createdDates()).toEqual([
        '2026-09-14',
        '2026-09-21',
        '2026-09-28',
        '2026-10-05',
        '2026-10-12',
      ]);
    });
  });

  describe('an ended plan', () => {
    beforeEach(() => setClock('2026-03-01T05:30:00.000Z')); // Sun 1 Mar, 11:00 IST

    const ended =
      'The updated collection plan ends on 31 Jan 2026, before today, so it would have no upcoming visits. Choose a new start date or a longer duration.';

    it('refuses moving its day without a new start date', async () => {
      await expectRefused(
        await editPlan(endedPlan(7), mobilePlan(7, ['Tuesday'], 30)),
        ended,
      );
    });

    it('refuses moving it from monthly to fortnightly without a new start date', async () => {
      await expectRefused(
        await editPlan(endedPlan(30), mobilePlan(14, ['Monday'], 30)),
        ended,
      );
    });

    it('refuses turning it into a one-time collection without a new start date', async () => {
      await expectRefused(
        await editPlan(endedPlan(7), mobilePlan(0, ['Monday'], 0)),
        'The one-time collection date, 5 Jan 2026, is before today, so it would have no upcoming visit. Choose a new start date.',
      );
    });

    it('saves an edit to an ended plan that started within the past month', async () => {
      // Edited on 1 Feb, exactly a month after its 1 Jan start, as the web
      // allows: it is scheduled anew from its start, all of it overdue. The
      // mobile app sends no start date, so the stored one is kept.
      setClock('2026-02-01T05:30:00.000Z');
      const edit = await editPlan(
        endedPlan(7),
        mobilePlan(14, ['Wednesday'], 30),
      );
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().collectionStartDate).toBeUndefined();
      expect(edit.setFields().collectionExpiryDate).toBe('2026-01-31 23:59:59');
      expectsWholePlanReplaced(edit);
      // The 1 Jan start, then every other Wednesday until 31 Jan.
      expect(edit.createdDates()).toEqual([
        '2026-01-01',
        '2026-01-07',
        '2026-01-21',
      ]);
    });

    it('schedules a new start date sent with the edit', async () => {
      const edit = await editPlan(endedPlan(7), {
        ...mobilePlan(7, ['Tuesday'], 30),
        collectionStartDate: '2026-02-02',
      });
      await edit.request;

      expect(edit.setFields().collectionStartDate).toBe('2026-02-02 00:00:00');
      expect(edit.setFields().collectionExpiryDate).toBe('2026-03-04 23:59:59');
      // The start date, then Tuesdays until 4 Mar.
      expect(edit.createdDates()).toEqual([
        '2026-02-02',
        '2026-02-03',
        '2026-02-10',
        '2026-02-17',
        '2026-02-24',
        '2026-03-03',
      ]);
    });

    it('saves the web form sent back unchanged apart from the collector', async () => {
      // The web form sends the whole plan, prefilled start date included.
      const edit = await editPlan(endedPlan(7), {
        collectionCollector: 'u2',
        collectionFrequency: 1,
        collectionFrequencyInterval: 7,
        collectionDuration: 30,
        collectionDayOfWeek: ['Monday'],
        collectionTime: '09:00',
        collectionStartDate: '2026-01-01',
      });
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.visitDelete()).toBeUndefined();
      expect(edit.manager.save).not.toHaveBeenCalled();
    });

    it('still saves edits that leave the plan alone, and keeps its visits', async () => {
      // Mobile sends the collector on every save, which used to trigger a
      // delete and regenerate even for an address change.
      const edit = await editPlan(
        endedPlan(7),
        mobileBody({ address: '2 Farm Road' }),
      );
      const response = await edit.request;

      expect(response.success).toBe(true);
      expect(edit.setFields().address).toBe('2 Farm Road');
      expect(edit.visitDelete()).toBeUndefined();
      expect(edit.manager.save).not.toHaveBeenCalled();
    });
  });
});
