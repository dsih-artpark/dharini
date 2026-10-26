import { DateTime, Settings } from 'luxon';
import {
  calculateAllCollectionDates,
  calculateNextCollectionDate,
  getNthWeekdayOfMonth,
  getPlusConfig,
  normalizeDaysOfWeek,
  toCollectionDay,
} from './site-collection';

/**
 * Regression tests for the production hang: a site whose
 * `collectionFrequencyInterval` is 0/null/undefined produced a `plus()` config
 * that never advanced the date, so the `while (date < now)` loops spun forever
 * on the main thread and wedged the whole Nest event loop.
 */
describe('site-collection', () => {
  const daysAgo = (n: number) =>
    DateTime.utc().startOf('day').minus({ days: n }).toJSDate();

  describe('getPlusConfig', () => {
    it.each([7, 14, 30, 90, 1, 3])(
      'returns an advancing config for valid interval %s',
      (interval) => {
        expect(getPlusConfig(interval)).not.toBeNull();
      },
    );

    it.each([0, -1, null, undefined, NaN, Infinity])(
      'returns null for non-advancing interval %s',
      (interval) => {
        expect(getPlusConfig(interval as number)).toBeNull();
      },
    );
  });

  describe('calculateNextCollectionDate', () => {
    // Each of these previously hung forever. Jest's per-test timeout is the
    // real assertion here: if the guard regresses, the suite times out.
    it.each([0, null, undefined, NaN])(
      'returns null instead of hanging when interval is %s and lastScheduleDate is past',
      (interval) => {
        const site = {
          collectionFrequencyInterval: interval,
          collectionStartDate: daysAgo(90),
          collectionLastScheduleDate: daysAgo(30),
        };

        expect(calculateNextCollectionDate(site, true)).toBeNull();
      },
      1000,
    );

    it.each([0, null, undefined, NaN])(
      'returns null instead of hanging when interval is %s and only startDate is set',
      (interval) => {
        const site = {
          collectionFrequencyInterval: interval,
          collectionStartDate: daysAgo(90),
          collectionLastScheduleDate: null,
        };

        expect(calculateNextCollectionDate(site, true)).toBeNull();
      },
      1000,
    );

    it('still advances past dates for a valid weekly interval', () => {
      const site = {
        collectionFrequencyInterval: 7,
        collectionStartDate: daysAgo(90),
        collectionLastScheduleDate: daysAgo(30),
      };

      const next = calculateNextCollectionDate(site, true);

      expect(next).not.toBeNull();
      expect(next!.isValid).toBe(true);
      expect(next! >= DateTime.utc().startOf('day')).toBe(true);
    });

    it('does not force a future date when forDisplay is false', () => {
      const site = {
        collectionFrequencyInterval: 7,
        collectionStartDate: daysAgo(90),
        collectionLastScheduleDate: daysAgo(30),
      };

      const next = calculateNextCollectionDate(site, false);

      expect(next!.toISODate()).toBe(
        DateTime.utc().startOf('day').minus({ days: 23 }).toISODate(),
      );
    });

    it('still honours a single collectionDayOfWeek even with an invalid interval', () => {
      // This branch advances by whole weeks and never touches plusConfig, so a
      // bad interval must not break it.
      const site = {
        collectionFrequencyInterval: 0,
        collectionDayOfWeek: ['Monday'],
        collectionStartDate: daysAgo(90),
        collectionLastScheduleDate: null,
      };

      const next = calculateNextCollectionDate(site, true);

      expect(next).not.toBeNull();
      expect(next!.weekday).toBe(1);
      expect(next! >= DateTime.utc().startOf('day')).toBe(true);
    });

    it('returns null when there is no start or last schedule date', () => {
      expect(
        calculateNextCollectionDate({
          collectionFrequencyInterval: 7,
          collectionStartDate: null,
          collectionLastScheduleDate: null,
        }),
      ).toBeNull();
    });
  });

  describe('calculateAllCollectionDates', () => {
    it('generates all weekly visits on Tuesday within the collection expiry date', () => {
      const site = {
        collectionStartDate: '2026-09-06T18:30:00.000Z', // Sunday UTC
        collectionExpiryDate: '2026-10-08T18:29:59.000Z', // 1 month later
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Tuesday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual([
        '2026-09-06', // start date
        '2026-09-08',
        '2026-09-15',
        '2026-09-22',
        '2026-09-29',
        '2026-10-06',
      ]);
      expect(dates.slice(1).every((d) => d.weekday === 2)).toBe(true); // All Tuesdays
    });

    it('generates visits based on collectionDuration if collectionExpiryDate is missing', () => {
      const site = {
        collectionStartDate: '2026-09-01T00:00:00.000Z', // Tuesday
        collectionDuration: 28,
        collectionFrequencyInterval: 7,
        collectionDayOfWeek: ['Tuesday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual([
        '2026-09-01',
        '2026-09-08',
        '2026-09-15',
        '2026-09-22',
        '2026-09-29',
      ]);
    });

    it('generates visits when no specific collectionDayOfWeek is provided', () => {
      const site = {
        collectionStartDate: '2026-09-01T00:00:00.000Z',
        collectionDuration: 14,
        collectionFrequencyInterval: 7,
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual(['2026-09-01', '2026-09-08', '2026-09-15']);
    });

    it('handles multiple days of the week in collectionDayOfWeek', () => {
      const site = {
        collectionStartDate: '2026-09-01T00:00:00.000Z', // Tuesday
        collectionDuration: 7,
        collectionFrequencyInterval: 1,
        collectionDayOfWeek: ['Tuesday', 'Thursday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual(['2026-09-01', '2026-09-03', '2026-09-08']);
    });

    it.each([-1, null, undefined, NaN])(
      'returns empty array when interval is %s without hanging',
      (interval) => {
        const site = {
          collectionStartDate: '2026-09-01T00:00:00.000Z',
          collectionDuration: 30,
          collectionFrequencyInterval: interval,
        };

        expect(calculateAllCollectionDates(site)).toEqual([]);
      },
    );

    it('advances to the matching weekday of next month when interval is monthly and single weekday is set', () => {
      const site = {
        collectionFrequencyInterval: 30,
        collectionDayOfWeek: ['Monday'],
        collectionStartDate: '2026-09-10T00:00:00.000Z',
        collectionLastScheduleDate: '2026-09-14T00:00:00.000Z',
      };

      const next = calculateNextCollectionDate(site, false);

      expect(next).not.toBeNull();
      // Sep 14 was the 2nd Monday; in October 2026 the 2nd Monday is Oct 12 (not Oct 14)
      expect(next!.toISODate()).toBe('2026-10-12');
      expect(next!.weekday).toBe(1); // Monday
    });

    it('returns empty array when collectionStartDate is missing', () => {
      expect(
        calculateAllCollectionDates({
          collectionFrequencyInterval: 7,
          collectionStartDate: null,
        }),
      ).toEqual([]);
    });

    it('schedules monthly visits on the corresponding Monday of each month (not calendar day-of-month)', () => {
      // User payload reproduction:
      // collectionStartDate: 2026-09-10 (Thursday)
      // collectionDayOfWeek: ['Monday']
      // collectionFrequencyInterval: 30 (monthly)
      // collectionDuration: 90 (days)
      const site = {
        collectionStartDate: '2026-09-10T00:00:00.000Z',
        collectionFrequencyInterval: 30,
        collectionDuration: 90,
        collectionDayOfWeek: ['Monday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      // 1st visit: 2026-09-10 (start date)
      // 2nd visit: 2026-09-14 (2nd Monday of Sep)
      // 3rd visit: 2026-10-12 (2nd Monday of Oct, NOT 2026-10-14)
      // 4th visit: 2026-11-09 (2nd Monday of Nov, NOT 2026-11-14)
      expect(isoDates).toEqual([
        '2026-09-10',
        '2026-09-14',
        '2026-10-12',
        '2026-11-09',
      ]);
      expect(dates.slice(1).every((d) => d.weekday === 1)).toBe(true); // All Mondays
    });

    it('schedules monthly visits on the 1st Monday when start date aligns with 1st Monday', () => {
      const site = {
        collectionStartDate: '2026-09-01T00:00:00.000Z',
        collectionFrequencyInterval: 30,
        collectionDuration: 90,
        collectionDayOfWeek: ['Monday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual([
        '2026-09-01', // start date (Tuesday)
        '2026-09-07',
        '2026-10-05',
        '2026-11-02',
      ]);
      expect(dates.slice(1).every((d) => d.weekday === 1)).toBe(true);
    });

    it('schedules quarterly visits on the matching weekday every 3 months', () => {
      const site = {
        collectionStartDate: '2026-09-10T00:00:00.000Z',
        collectionFrequencyInterval: 90,
        collectionDuration: 360,
        collectionDayOfWeek: ['Monday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      // Sep 10 (start date) -> Sep 14 (2nd Mon of Sep) -> Dec 14 (2nd Mon of Dec) -> Mar 8 (2nd Mon of Mar) -> Jun 14 (2nd Mon of Jun)
      expect(isoDates).toEqual([
        '2026-09-10',
        '2026-09-14',
        '2026-12-14',
        '2027-03-08',
        '2027-06-14',
      ]);
      expect(dates.slice(1).every((d) => d.weekday === 1)).toBe(true);
    });

    it('schedules exactly one visit for a "Once" plan (interval 0)', () => {
      const site = {
        collectionStartDate: '2026-09-15T00:00:00.000Z',
        collectionFrequencyInterval: 0,
        collectionDuration: 0,
        collectionDayOfWeek: ['Tuesday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      expect(isoDates).toEqual(['2026-09-15']);
      expect(dates.length).toBe(1);
    });

    it('respects frequency when multiple weekdays are selected (fortnightly)', () => {
      const site = {
        collectionStartDate: '2026-09-15T00:00:00.000Z',
        collectionFrequencyInterval: 14,
        collectionDuration: 30,
        collectionDayOfWeek: ['Tuesday', 'Thursday'],
      };

      const dates = calculateAllCollectionDates(site);
      const isoDates = dates.map((d) => d.toISODate());

      // Should only schedule Tue & Thu during the active cycle weeks (every 2 weeks)
      expect(isoDates).toEqual([
        '2026-09-15',
        '2026-09-17',
        '2026-09-29',
        '2026-10-01',
        '2026-10-13',
        '2026-10-15',
      ]);
    });

    it('filters out past dates when options.fromDate is provided', () => {
      const site = {
        collectionStartDate: '2026-09-01T00:00:00.000Z',
        collectionFrequencyInterval: 7,
        collectionDuration: 30,
        collectionDayOfWeek: ['Monday'],
      };

      const fromDate = DateTime.fromISO('2026-09-15', { zone: 'utc' }).startOf(
        'day',
      );
      const dates = calculateAllCollectionDates(site, { fromDate });
      const isoDates = dates.map((d) => d.toISODate());

      // Full list would be 09-01 (start date), 09-07, 09-14, 09-21, 09-28.
      // With fromDate = 09-15, 09-01, 09-07 and 09-14 are excluded.
      expect(isoDates).toEqual(['2026-09-21', '2026-09-28']);
    });
  });

  describe('calculateAllCollectionDates start-date visit', () => {
    const isoDates = (site: any, options?: { fromDate?: DateTime }) =>
      calculateAllCollectionDates(site, options).map((d) => d.toISODate());

    // 2026-10-10 is a Saturday.
    const saturdayStart = {
      collectionStartDate: '2026-10-10',
      collectionDayOfWeek: ['Monday'],
    };

    it('adds a Saturday start before the weekly Mondays and keeps the last date', () => {
      const dates = isoDates({
        ...saturdayStart,
        collectionFrequencyInterval: 7,
        collectionDuration: 30,
      });

      expect(dates).toEqual([
        '2026-10-10',
        '2026-10-12',
        '2026-10-19',
        '2026-10-26',
        '2026-11-02',
        '2026-11-09',
      ]);
    });

    it('adds a Saturday start before the fortnightly Mondays', () => {
      expect(
        isoDates({
          ...saturdayStart,
          collectionFrequencyInterval: 14,
          collectionDuration: 30,
        }),
      ).toEqual(['2026-10-10', '2026-10-12', '2026-10-26', '2026-11-09']);
    });

    it('adds a Saturday start without moving the monthly 2nd-Monday anchor', () => {
      expect(
        isoDates({
          ...saturdayStart,
          collectionFrequencyInterval: 30,
          collectionDuration: 90,
        }),
      ).toEqual(['2026-10-10', '2026-10-12', '2026-11-09', '2026-12-14']);
    });

    it('adds a Saturday start without moving the quarterly 2nd-Monday anchor', () => {
      expect(
        isoDates({
          ...saturdayStart,
          collectionFrequencyInterval: 90,
          collectionDuration: 360,
        }),
      ).toEqual([
        '2026-10-10',
        '2026-10-12',
        '2027-01-11',
        '2027-04-12',
        '2027-07-12',
      ]);
    });

    it('stops at the stored expiry date', () => {
      expect(
        isoDates({
          ...saturdayStart,
          collectionFrequencyInterval: 7,
          collectionExpiryDate: '2026-11-08T23:59:59.000Z',
        }),
      ).toEqual([
        '2026-10-10',
        '2026-10-12',
        '2026-10-19',
        '2026-10-26',
        '2026-11-02',
      ]);
    });

    it('adds the start date to a multi-day plan that does not include it', () => {
      expect(
        isoDates({
          collectionStartDate: '2026-10-10',
          collectionFrequencyInterval: 7,
          collectionDuration: 14,
          collectionDayOfWeek: ['Tuesday', 'Thursday'],
        }),
      ).toEqual([
        '2026-10-10',
        '2026-10-13',
        '2026-10-15',
        '2026-10-20',
        '2026-10-22',
      ]);
    });

    it.each([7, 14, 30, 90])(
      'does not duplicate a start date that is already a preferred day (interval %s)',
      (interval) => {
        const dates = isoDates({
          collectionStartDate: '2026-10-12', // Monday
          collectionFrequencyInterval: interval,
          collectionDuration: 90,
          collectionDayOfWeek: ['Monday'],
        });

        expect(dates[0]).toBe('2026-10-12');
        expect(dates.filter((d) => d === '2026-10-12')).toHaveLength(1);
        expect(new Set(dates).size).toBe(dates.length);
      },
    );

    it('does not duplicate a start date that one of several preferred days covers', () => {
      expect(
        isoDates({
          collectionStartDate: '2026-10-10',
          collectionFrequencyInterval: 7,
          collectionDuration: 14,
          collectionDayOfWeek: ['Monday', 'Saturday'],
        }),
      ).toEqual([
        '2026-10-10',
        '2026-10-12',
        '2026-10-17',
        '2026-10-19',
        '2026-10-24',
      ]);
    });

    it.each([
      ['Saturday', ['2026-10-10']],
      ['Monday', ['2026-10-12']],
    ])(
      'keeps a once plan to a single visit when its day is %s',
      (day, expected) => {
        expect(
          isoDates({
            collectionStartDate: '2026-10-10',
            collectionFrequencyInterval: 0,
            collectionDuration: 0,
            collectionDayOfWeek: [day],
          }),
        ).toEqual(expected);
      },
    );

    it('keeps the start date when a plan edit regenerates from that same day', () => {
      const fromDate = DateTime.utc(2026, 10, 10);
      expect(
        isoDates(
          {
            ...saturdayStart,
            collectionFrequencyInterval: 7,
            collectionDuration: 30,
          },
          { fromDate },
        )[0],
      ).toBe('2026-10-10');
    });

    it('drops a past start date when a plan edit only regenerates future visits', () => {
      const fromDate = DateTime.utc(2026, 10, 11);
      expect(
        isoDates(
          {
            ...saturdayStart,
            collectionFrequencyInterval: 7,
            collectionDuration: 30,
          },
          { fromDate },
        ),
      ).toEqual([
        '2026-10-12',
        '2026-10-19',
        '2026-10-26',
        '2026-11-02',
        '2026-11-09',
      ]);
    });

    it('returns no dates for an unparseable start date', () => {
      expect(
        calculateAllCollectionDates({
          collectionStartDate: 'not-a-date',
          collectionFrequencyInterval: 7,
          collectionDuration: 30,
        }),
      ).toEqual([]);
    });
  });

  describe('calculateAllCollectionDates timezone boundaries', () => {
    const originalZone = Settings.defaultZone;
    afterEach(() => {
      Settings.defaultZone = originalZone;
    });

    // What node-postgres hands back for a `timestamp without time zone` value
    // when the server process runs in `zone`.
    const pgTimestamp = (zone: string, wallClock: string) =>
      DateTime.fromISO(wallClock, { zone }).toJSDate();

    it.each(['UTC', 'Asia/Kolkata'])(
      'reads the stored start and expiry days on a %s server',
      (zone) => {
        Settings.defaultZone = zone;

        const dates = calculateAllCollectionDates({
          collectionStartDate: pgTimestamp(zone, '2026-10-10T00:00:00'),
          collectionExpiryDate: pgTimestamp(zone, '2026-11-09T23:59:59'),
          collectionFrequencyInterval: 7,
          collectionDayOfWeek: ['Monday'],
        }).map((d) => d.toISODate());

        // On an IST server the start arrives as 2026-10-09T18:30Z; it must
        // still be Saturday the 10th, not a visit on Friday the 9th.
        expect(dates).toEqual([
          '2026-10-10',
          '2026-10-12',
          '2026-10-19',
          '2026-10-26',
          '2026-11-02',
          '2026-11-09',
        ]);
      },
    );

    it('keeps the written day of an ISO start date carrying an IST offset', () => {
      const dates = calculateAllCollectionDates({
        collectionStartDate: '2026-10-10T00:00:00.000+05:30',
        collectionFrequencyInterval: 7,
        collectionDuration: 30,
        collectionDayOfWeek: ['Monday'],
      });

      expect(dates[0].toISODate()).toBe('2026-10-10');
      expect(dates[0].weekday).toBe(6); // Saturday
    });

    it.each(['UTC', 'Asia/Kolkata', 'America/Los_Angeles'])(
      'reads a date-only start date as that day on a %s server',
      (zone) => {
        Settings.defaultZone = zone;
        expect(toCollectionDay('2026-10-10').toISO()).toBe(
          '2026-10-10T00:00:00.000Z',
        );
      },
    );
  });

  describe('getNthWeekdayOfMonth', () => {
    it('finds the 2nd Monday of October 2026', () => {
      const dt = getNthWeekdayOfMonth(2026, 10, 1, 2);
      expect(dt.toISODate()).toBe('2026-10-12');
      expect(dt.weekday).toBe(1);
    });

    it('finds the 1st Monday of October 2026', () => {
      const dt = getNthWeekdayOfMonth(2026, 10, 1, 1);
      expect(dt.toISODate()).toBe('2026-10-05');
      expect(dt.weekday).toBe(1);
    });

    it('falls back to the last occurrence in month when 5th occurrence does not exist', () => {
      // April 2026 only has 4 Mondays (Apr 6, 13, 20, 27)
      const dt = getNthWeekdayOfMonth(2026, 4, 1, 5);
      expect(dt.toISODate()).toBe('2026-04-27');
      expect(dt.month).toBe(4);
      expect(dt.weekday).toBe(1);
    });
  });

  describe('normalizeDaysOfWeek', () => {
    it('handles string array', () => {
      expect(normalizeDaysOfWeek(['Monday', 'Wednesday'])).toEqual([
        'Monday',
        'Wednesday',
      ]);
    });

    it('handles Postgres-style array string', () => {
      expect(normalizeDaysOfWeek('{Monday}')).toEqual(['Monday']);
      expect(normalizeDaysOfWeek('{Monday,Tuesday}')).toEqual([
        'Monday',
        'Tuesday',
      ]);
    });

    it('handles single string', () => {
      expect(normalizeDaysOfWeek('Monday')).toEqual(['Monday']);
    });

    it('handles empty and null values gracefully', () => {
      expect(normalizeDaysOfWeek([])).toEqual([]);
      expect(normalizeDaysOfWeek(null)).toEqual([]);
      expect(normalizeDaysOfWeek(undefined)).toEqual([]);
      expect(normalizeDaysOfWeek('')).toEqual([]);
    });
  });
});
