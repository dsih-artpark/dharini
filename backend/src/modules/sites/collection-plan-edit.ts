import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  calculateAllCollectionDates,
  normalizeDaysOfWeek,
  toCollectionDay,
} from 'src/common/functions/site-collection';

/** The site columns that decide when a collection plan's visits fall. */
export interface CollectionSchedule {
  collectionFrequencyInterval?: number | null;
  collectionDayOfWeek?: string[] | null;
  collectionDuration?: number | null;
  collectionStartDate?: Date | null;
  collectionExpiryDate?: Date | null;
}

/**
 * What a site update sets on those columns. Absent or null values keep the
 * stored ones. New dates come from the controller as 'yyyy-MM-dd HH:mm:ss'
 * wall-clock strings.
 */
export interface CollectionScheduleUpdate {
  collectionFrequencyInterval?: number | null;
  collectionDayOfWeek?: string[] | null;
  collectionDuration?: number | null;
  collectionStartDate?: Date | string | null;
  collectionExpiryDate?: Date | string | null;
}

export interface CollectionScheduleEdit {
  /** The schedule once the update is saved. */
  schedule: CollectionSchedule;
  /** The update moves the plan's dates: interval, days, duration, start or expiry. */
  changed: boolean;
  /** The update moves the start date to another day. */
  startChanged: boolean;
  /**
   * A repeating plan was sent a duration of 0, as older app builds did for a
   * duration they never touched. The stored duration is kept.
   */
  keepsStoredDuration: boolean;
  /**
   * The update sends the stored duration back, with the plan's other dates
   * unchanged, but its expiry differs. The controller recomputes the expiry
   * from the start date whenever it is sent a duration, as on every save of
   * the web form; plans saved before that counted it from the day they were
   * saved. The stored expiry is kept, so such a save doesn't move the plan.
   */
  keepsStoredExpiry: boolean;
  /**
   * The plan becomes a one-time collection. Those are created without an
   * expiry, and a repeating plan's old expiry could otherwise fall before the
   * one-time date and leave it unscheduled.
   */
  clearsExpiry: boolean;
}

export function previewScheduleEdit(
  stored: CollectionSchedule,
  update: CollectionScheduleUpdate,
): CollectionScheduleEdit {
  const interval =
    update.collectionFrequencyInterval ?? stored.collectionFrequencyInterval;
  const isOnce = interval != null && Number(interval) === 0;
  const keepsStoredDuration =
    update.collectionDuration != null &&
    !isOnce &&
    Number(update.collectionDuration) <= 0;

  const schedule: CollectionSchedule = {
    collectionFrequencyInterval: interval,
    collectionDayOfWeek:
      update.collectionDayOfWeek ?? stored.collectionDayOfWeek,
    collectionDuration: keepsStoredDuration
      ? stored.collectionDuration
      : (update.collectionDuration ?? stored.collectionDuration),
    collectionStartDate:
      asStoredDate(update.collectionStartDate) ?? stored.collectionStartDate,
    collectionExpiryDate:
      asStoredDate(update.collectionExpiryDate) ?? stored.collectionExpiryDate,
  };

  const keepsStoredExpiry =
    update.collectionDuration != null &&
    !sameDay(stored.collectionExpiryDate, schedule.collectionExpiryDate) &&
    sameSchedule(stored, {
      ...schedule,
      collectionExpiryDate: stored.collectionExpiryDate,
    });
  if (keepsStoredExpiry) {
    schedule.collectionExpiryDate = stored.collectionExpiryDate;
  }

  const changed = !sameSchedule(stored, schedule);
  const startChanged = !sameDay(
    stored.collectionStartDate,
    schedule.collectionStartDate,
  );
  const clearsExpiry = changed && isOnce && !!schedule.collectionExpiryDate;
  if (clearsExpiry) schedule.collectionExpiryDate = null;

  return {
    schedule,
    changed,
    startChanged,
    keepsStoredDuration,
    keepsStoredExpiry,
    clearsExpiry,
  };
}

/** The schedule's collection dates from today on. */
export function upcomingCollectionDates(
  schedule: CollectionSchedule,
): DateTime[] {
  return calculateAllCollectionDates(schedule, {
    fromDate: DateTime.utc().startOf('day'),
  });
}

/**
 * Whether a plan starts within the past month. A plan starting here, new or
 * edited, may be saved with no upcoming visit: it is scheduled from its start
 * date, so its past dates become overdue visits.
 * The apps' start-date pickers allow the same day one month ago, clamped to
 * that month's last day. One more day covers a user west of
 * UTC, whose local date can be a day behind the server's UTC date.
 */
export function startsWithinPastMonth(
  schedule: CollectionSchedule,
  today: DateTime = DateTime.utc().startOf('day'),
): boolean {
  if (!schedule.collectionStartDate) return false;
  const start = toCollectionDay(schedule.collectionStartDate);
  const earliest = today.minus({ months: 1 }).minus({ days: 1 });
  return start.isValid && start >= earliest;
}

/**
 * Refuses an edited plan that started more than a month back and would leave
 * its collector with no upcoming visit. Such an ended plan is not restarted on
 * its own: the edit has to bring a new start date or a longer duration.
 */
export function noUpcomingVisitsError(
  schedule: CollectionSchedule,
): BadRequestException {
  const format = (day: DateTime) => day.toFormat('d MMM yyyy');

  if (Number(schedule.collectionFrequencyInterval) === 0) {
    const [date] = calculateAllCollectionDates(schedule);
    return new BadRequestException(
      date
        ? `The one-time collection date, ${format(date)}, is before today, so it would have no upcoming visit. Choose a new start date.`
        : 'The one-time collection has no upcoming date. Choose a new start date.',
    );
  }

  const end = schedule.collectionExpiryDate
    ? toCollectionDay(schedule.collectionExpiryDate)
    : null;
  if (end?.isValid && end < DateTime.utc().startOf('day')) {
    return new BadRequestException(
      `The updated collection plan ends on ${format(end)}, before today, so it would have no upcoming visits. Choose a new start date or a longer duration.`,
    );
  }
  return new BadRequestException(
    'The updated collection plan has no upcoming collection dates. Choose a new start date or a longer duration.',
  );
}

/**
 * Refuses an edit that moves the start date back more than the past month,
 * as the apps' start-date pickers do. An unchanged older start date is kept.
 */
export function startTooFarBackError(
  schedule: CollectionSchedule,
): BadRequestException {
  const start = toCollectionDay(schedule.collectionStartDate);
  return new BadRequestException(
    `The new collection start date, ${start.toFormat('d MMM yyyy')}, is more than one month in the past. Choose a later start date.`,
  );
}

// node-postgres reads `timestamp without time zone` columns back as Dates in
// the server's local zone, so the controller's strings are parsed the same way.
function asStoredDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const stored = DateTime.fromFormat(value, 'yyyy-MM-dd HH:mm:ss');
  return (stored.isValid ? stored : DateTime.fromISO(value)).toJSDate();
}

function sameSchedule(a: CollectionSchedule, b: CollectionSchedule): boolean {
  return (
    sameNumber(a.collectionFrequencyInterval, b.collectionFrequencyInterval) &&
    daysKey(a.collectionDayOfWeek) === daysKey(b.collectionDayOfWeek) &&
    sameNumber(a.collectionDuration, b.collectionDuration) &&
    sameDay(a.collectionStartDate, b.collectionStartDate) &&
    sameDay(a.collectionExpiryDate, b.collectionExpiryDate)
  );
}

function sameNumber(a?: number | null, b?: number | null): boolean {
  if (a == null || b == null) return a == null && b == null;
  return Number(a) === Number(b);
}

function daysKey(days?: string[] | null): string {
  return normalizeDaysOfWeek(days)
    .map((day) => day.toLowerCase())
    .sort()
    .join();
}

function sameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return !a && !b;
  return toCollectionDay(a).hasSame(toCollectionDay(b), 'day');
}
