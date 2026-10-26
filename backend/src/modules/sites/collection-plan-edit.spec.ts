import { DateTime } from 'luxon';
import {
  CollectionSchedule,
  previewScheduleEdit,
  startsWithinPastMonth,
} from './collection-plan-edit';

/**
 * Only an edit that moves the plan's dates counts as a schedule change. The
 * web form sends the whole plan on every save, so values that come back in
 * another form (day order or case, the start date as the controller formats
 * it) must not read as a change.
 */
describe('previewScheduleEdit', () => {
  // As node-postgres returns the stored columns: local wall-clock Dates.
  const stored = (sql: string) => DateTime.fromSQL(sql).toJSDate();

  const plan: CollectionSchedule = {
    collectionFrequencyInterval: 7,
    collectionDayOfWeek: ['Monday', 'Thursday'],
    collectionDuration: 120,
    collectionStartDate: stored('2026-09-07 00:00:00'),
    collectionExpiryDate: stored('2027-01-05 23:59:59'),
  };

  it('treats the stored plan sent back unchanged as no change', () => {
    const edit = previewScheduleEdit(plan, {
      collectionFrequencyInterval: 7,
      collectionDayOfWeek: ['thursday', 'Monday'],
      collectionDuration: 120,
      collectionStartDate: '2026-09-07 00:00:00',
      collectionExpiryDate: '2027-01-05 23:59:59',
    });

    expect(edit.changed).toBe(false);
    expect(edit.startChanged).toBe(false);
    expect(edit.clearsExpiry).toBe(false);
    expect(edit.keepsStoredDuration).toBe(false);
  });

  it('only counts a start date on another day as a moved start', () => {
    // The mobile app sends no start date, so the stored one is kept.
    expect(
      previewScheduleEdit(plan, { collectionDayOfWeek: ['Tuesday'] })
        .startChanged,
    ).toBe(false);
    expect(
      previewScheduleEdit(plan, { collectionStartDate: '2026-09-14 00:00:00' })
        .startChanged,
    ).toBe(true);
  });

  it.each([
    ['frequency', { collectionFrequencyInterval: 14 }],
    ['days', { collectionDayOfWeek: ['Tuesday'] }],
    ['duration', { collectionDuration: 90 }],
    ['start date', { collectionStartDate: '2026-10-12 00:00:00' }],
    ['expiry', { collectionExpiryDate: '2026-12-31 23:59:59' }],
  ])('treats a new %s as a change', (_, update) => {
    expect(previewScheduleEdit(plan, update).changed).toBe(true);
  });

  it('keeps the stored duration when a repeating plan is sent 0', () => {
    const edit = previewScheduleEdit(plan, {
      collectionDayOfWeek: ['Tuesday'],
      collectionDuration: 0,
    });

    expect(edit.keepsStoredDuration).toBe(true);
    expect(edit.schedule.collectionDuration).toBe(120);
  });

  describe('a plan whose stored expiry was counted from the day it was saved', () => {
    // From 7 Sep for 120 days, saved on 22 Sep, so it ends on 20 Jan rather
    // than 5 Jan.
    const legacyPlan: CollectionSchedule = {
      ...plan,
      collectionExpiryDate: stored('2027-01-20 23:59:59'),
    };
    // The web form sends the whole plan, and the controller recounts the
    // expiry from the start date.
    const webSave = {
      collectionFrequencyInterval: 7,
      collectionDayOfWeek: ['Monday', 'Thursday'],
      collectionDuration: 120,
      collectionStartDate: '2026-09-07 00:00:00',
      collectionExpiryDate: '2027-01-05 23:59:59',
    };

    it('keeps its expiry when the plan is sent back unchanged', () => {
      const edit = previewScheduleEdit(legacyPlan, webSave);

      expect(edit.keepsStoredExpiry).toBe(true);
      expect(edit.changed).toBe(false);
      expect(edit.schedule.collectionExpiryDate).toBe(
        legacyPlan.collectionExpiryDate,
      );
    });

    it.each([
      ['frequency', { collectionFrequencyInterval: 14 }],
      ['days', { collectionDayOfWeek: ['Tuesday'] }],
      [
        'duration',
        { collectionDuration: 90, collectionExpiryDate: '2026-12-06 23:59:59' },
      ],
      [
        'start date',
        {
          collectionStartDate: '2026-09-14 00:00:00',
          collectionExpiryDate: '2027-01-12 23:59:59',
        },
      ],
    ])('takes the recounted expiry with a new %s', (_, update) => {
      const sent = { ...webSave, ...update };
      const edit = previewScheduleEdit(legacyPlan, sent);

      expect(edit.keepsStoredExpiry).toBe(false);
      expect(edit.changed).toBe(true);
      expect(edit.schedule.collectionExpiryDate).toEqual(
        stored(sent.collectionExpiryDate),
      );
    });

    it('is not touched by a save that sends no duration', () => {
      const edit = previewScheduleEdit(legacyPlan, {
        collectionDayOfWeek: ['Monday', 'Thursday'],
      });

      expect(edit.keepsStoredExpiry).toBe(false);
      expect(edit.changed).toBe(false);
    });
  });

  it('takes duration 0 for a one-time plan, and drops the old expiry', () => {
    const edit = previewScheduleEdit(plan, {
      collectionFrequencyInterval: 0,
      collectionDayOfWeek: ['Monday'],
      collectionDuration: 0,
    });

    expect(edit.keepsStoredDuration).toBe(false);
    expect(edit.schedule.collectionDuration).toBe(0);
    expect(edit.clearsExpiry).toBe(true);
    expect(edit.schedule.collectionExpiryDate).toBeNull();
  });

  it('leaves an unedited one-time plan as it is stored', () => {
    const once: CollectionSchedule = {
      ...plan,
      collectionFrequencyInterval: 0,
      collectionDayOfWeek: ['Monday'],
      collectionDuration: 0,
    };

    const edit = previewScheduleEdit(once, {});

    expect(edit.changed).toBe(false);
    expect(edit.clearsExpiry).toBe(false);
    expect(edit.schedule.collectionExpiryDate).toEqual(
      once.collectionExpiryDate,
    );
  });
});

describe('startsWithinPastMonth', () => {
  const stored = (sql: string) => DateTime.fromSQL(sql).toJSDate();
  const starting = (sql: string): CollectionSchedule => ({
    collectionStartDate: stored(sql),
  });

  it('allows the same day one month ago, and refuses an earlier start', () => {
    const today = DateTime.utc(2026, 10, 14);

    expect(startsWithinPastMonth(starting('2026-09-14 00:00:00'), today)).toBe(
      true,
    );
    expect(startsWithinPastMonth(starting('2026-09-12 00:00:00'), today)).toBe(
      false,
    );
  });

  it('clamps to the last day of a shorter month, as the apps do', () => {
    // 31 Mar less one month is 28 Feb; the apps' earliest date is 28 Feb.
    const today = DateTime.utc(2026, 3, 31);

    expect(startsWithinPastMonth(starting('2026-02-28 00:00:00'), today)).toBe(
      true,
    );
    expect(startsWithinPastMonth(starting('2026-02-26 00:00:00'), today)).toBe(
      false,
    );
  });

  it('handles a leap-year February', () => {
    // 31 Mar 2028 less one month is 29 Feb 2028.
    const today = DateTime.utc(2028, 3, 31);

    expect(startsWithinPastMonth(starting('2028-02-29 00:00:00'), today)).toBe(
      true,
    );
    expect(startsWithinPastMonth(starting('2028-02-26 00:00:00'), today)).toBe(
      false,
    );
  });

  it('crosses from January back to December', () => {
    const today = DateTime.utc(2027, 1, 14);

    expect(startsWithinPastMonth(starting('2026-12-14 00:00:00'), today)).toBe(
      true,
    );
    expect(startsWithinPastMonth(starting('2026-12-11 00:00:00'), today)).toBe(
      false,
    );
  });

  it('refuses a plan with no start date', () => {
    expect(
      startsWithinPastMonth({ collectionStartDate: null }, DateTime.utc()),
    ).toBe(false);
  });
});
