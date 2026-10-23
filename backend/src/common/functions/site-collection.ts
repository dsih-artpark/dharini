import { DateTime } from 'luxon';

export function weekdayStringToNumber(day: string) {
  const map = {
    Sunday: 7,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[day];
}

/**
 * Builds the luxon `plus()` config used to step from one collection date to the
 * next. Returns `null` when the interval cannot advance a date (0, negative,
 * null/undefined or non-finite) — callers must not loop on such a config, since
 * `date.plus({ days: 0 })` returns the same date forever and spins the event
 * loop.
 */
export function getPlusConfig(intervalDays: number) {
  const interval = Number(intervalDays);
  if (!Number.isFinite(interval) || interval <= 0) return null;

  if (interval === 7) return { weeks: 1 };
  if (interval === 14) return { weeks: 2 };
  if (interval === 30) return { months: 1 };
  if (interval === 90) return { months: 3 };

  return { days: interval };
}

export function normalizeDaysOfWeek(collectionDayOfWeek: any): string[] {
  if (Array.isArray(collectionDayOfWeek)) {
    return collectionDayOfWeek.map((s) => String(s).trim()).filter(Boolean);
  }
  if (
    typeof collectionDayOfWeek === 'string' &&
    collectionDayOfWeek.trim().length > 0
  ) {
    return collectionDayOfWeek
      .replace(/^\{|\}$/g, '')
      .split(',')
      .map((s) => s.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  }
  return [];
}

/**
 * Returns the DateTime representing the nth occurrence of a given weekday
 * (1 = Monday, 7 = Sunday) in the specified year and month.
 * If the month contains fewer occurrences than nth (e.g. asking for 5th Monday
 * in a month with only 4 Mondays), returns the last occurrence in that month.
 */
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  nth: number,
): DateTime {
  const firstOfMonth = DateTime.utc(year, month, 1);
  const diffDays = (weekday - firstOfMonth.weekday + 7) % 7;
  const firstOccurrence = firstOfMonth.plus({ days: diffDays });
  let candidate = firstOccurrence.plus({ weeks: nth - 1 });

  // If candidate overflowed past the target month, walk back to the last occurrence in target month
  while (candidate.month !== month && candidate > firstOfMonth) {
    candidate = candidate.minus({ weeks: 1 });
  }

  return candidate;
}

export function calculateNextCollectionDate(
  site: any,
  forDisplay: boolean = false,
): DateTime | null {
  const {
    collectionFrequencyInterval: intervalDays,
    collectionDayOfWeek,
    collectionStartDate,
    collectionLastScheduleDate,
  } = site;

  if (!collectionStartDate && !collectionLastScheduleDate) {
    return null;
  }

  const now = DateTime.utc().startOf('day');

  // Parse startDate
  const startDate = collectionStartDate
    ? DateTime.fromJSDate(new Date(collectionStartDate), {
        zone: 'utc',
      }).startOf('day')
    : null;

  const plusConfig = getPlusConfig(intervalDays);
  const normalizedDays = normalizeDaysOfWeek(collectionDayOfWeek);
  const singleWeekday =
    normalizedDays.length === 1
      ? weekdayStringToNumber(normalizedDays[0])
      : null;

  // If no last schedule date, use the start date
  if (!collectionLastScheduleDate) {
    if (!startDate) return null;

    if (singleWeekday) {
      const diffDays = (singleWeekday - startDate.weekday + 7) % 7;
      let nextVisitDate: DateTime = startDate.plus({ days: diffDays });

      if (nextVisitDate >= now) {
        return nextVisitDate;
      }

      while (nextVisitDate < now) {
        if (plusConfig?.months) {
          const nth = Math.floor((nextVisitDate.day - 1) / 7) + 1;
          const currentMonth = nextVisitDate
            .startOf('month')
            .plus({ months: plusConfig.months });
          nextVisitDate = getNthWeekdayOfMonth(
            currentMonth.year,
            currentMonth.month,
            singleWeekday,
            nth,
          );
        } else {
          nextVisitDate = nextVisitDate.plus(plusConfig ?? { weeks: 1 });
        }
      }
      return nextVisitDate;
    }

    // If startDate is today or in the future, use it directly
    if (startDate >= now) {
      return startDate;
    }

    // Fallback: just add intervals from startDate until we surpass 'now'.
    // A null config cannot advance the date, so there is no next occurrence.
    if (!plusConfig) return null;

    let nextVisitDate = startDate;
    while (nextVisitDate < now) {
      nextVisitDate = nextVisitDate.plus(plusConfig);
    }

    return nextVisitDate;
  }

  // Parse lastScheduleDate
  const last = DateTime.fromJSDate(new Date(collectionLastScheduleDate), {
    zone: 'utc',
  }).startOf('day');

  if (!plusConfig) return null;

  let nextDate: DateTime;
  let currentMonth = last.startOf('month');

  if (singleWeekday && plusConfig.months) {
    const nth = Math.floor((last.day - 1) / 7) + 1;
    currentMonth = currentMonth.plus({ months: plusConfig.months });
    nextDate = getNthWeekdayOfMonth(
      currentMonth.year,
      currentMonth.month,
      singleWeekday,
      nth,
    );
  } else {
    nextDate = last.plus(plusConfig);
  }

  // If for display, ensure we show a date in the future
  if (forDisplay) {
    while (nextDate < now) {
      if (singleWeekday && plusConfig.months) {
        const nth = Math.floor((last.day - 1) / 7) + 1;
        currentMonth = currentMonth.plus({ months: plusConfig.months });
        nextDate = getNthWeekdayOfMonth(
          currentMonth.year,
          currentMonth.month,
          singleWeekday,
          nth,
        );
      } else {
        nextDate = nextDate.plus(plusConfig);
      }
    }
  }

  return nextDate;
}

/**
 * Returns the calendar day a stored collection date refers to, as UTC midnight.
 *
 * `collectionStartDate` is a `timestamp without time zone` column holding the
 * picked day at 00:00:00. node-postgres reads such values in the server's local
 * zone, so the same row arrives as 00:00Z on a UTC server but as 18:30Z on the
 * previous day on an IST one. Reading the Date back in that local zone recovers
 * the stored day on both. Strings are taken at the date they are written with.
 */
export function toCollectionDay(value: Date | string): DateTime {
  const local =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(String(value), { setZone: true });
  return DateTime.utc(local.year, local.month, local.day);
}

/**
 * Calculates all scheduled collection dates between collectionStartDate and collectionExpiryDate
 * (or collectionStartDate + collectionDuration).
 * Repeating plans always include the start date itself, followed by the
 * recurring dates on the preferred days.
 * Returns an array of DateTime objects in UTC startOf('day').
 */
export function calculateAllCollectionDates(
  site: any,
  options?: { fromDate?: DateTime },
): DateTime[] {
  const {
    collectionFrequencyInterval: intervalDays,
    collectionDayOfWeek,
    collectionStartDate,
    collectionExpiryDate,
    collectionDuration,
  } = site;

  if (!collectionStartDate) {
    return [];
  }

  if (
    intervalDays === null ||
    intervalDays === undefined ||
    Number.isNaN(Number(intervalDays)) ||
    Number(intervalDays) < 0
  ) {
    return [];
  }

  const interval = Number(intervalDays);

  const startDate = toCollectionDay(collectionStartDate);
  if (!startDate.isValid) {
    return [];
  }

  let expiryDate: DateTime | null = null;
  if (collectionExpiryDate) {
    expiryDate = DateTime.fromJSDate(new Date(collectionExpiryDate), {
      zone: 'utc',
    }).endOf('day');
  } else if (collectionDuration && Number(collectionDuration) > 0) {
    expiryDate = startDate
      .plus({ days: Number(collectionDuration) })
      .endOf('day');
  } else {
    // Default fallback to 30 days if neither expiryDate nor duration is specified
    expiryDate = startDate.plus({ days: 30 }).endOf('day');
  }

  if (expiryDate < startDate) {
    return [];
  }

  const normalizedDays = normalizeDaysOfWeek(collectionDayOfWeek);

  // 1. Handle "Once" plan (interval 0)
  if (interval === 0) {
    let onceDate = startDate;
    if (normalizedDays.length > 0) {
      const targetWeekday = weekdayStringToNumber(normalizedDays[0]);
      if (targetWeekday) {
        const diffDays = (targetWeekday - startDate.weekday + 7) % 7;
        onceDate = startDate.plus({ days: diffDays });
      }
    }
    if (onceDate <= expiryDate) {
      if (options?.fromDate && onceDate < options.fromDate) {
        return [];
      }
      return [onceDate];
    }
    return [];
  }

  const plusConfig = getPlusConfig(interval);
  if (!plusConfig) {
    return [];
  }

  const dates: DateTime[] = [];
  const maxVisits = 366; // Prevent runaway loops

  if (normalizedDays.length === 1) {
    const targetWeekday = weekdayStringToNumber(normalizedDays[0]);
    if (targetWeekday) {
      const diffDays = (targetWeekday - startDate.weekday + 7) % 7;
      let current = startDate.plus({ days: diffDays });

      if (plusConfig.months) {
        const nth = Math.floor((current.day - 1) / 7) + 1;
        let currentMonth = current.startOf('month');

        while (current <= expiryDate && dates.length < maxVisits) {
          dates.push(current);
          currentMonth = currentMonth.plus({ months: plusConfig.months });
          current = getNthWeekdayOfMonth(
            currentMonth.year,
            currentMonth.month,
            targetWeekday,
            nth,
          );
        }
      } else {
        while (current <= expiryDate && dates.length < maxVisits) {
          dates.push(current);
          current = current.plus(plusConfig);
        }
      }
    }
  } else if (normalizedDays.length > 1) {
    // Multiple days of the week (e.g. ['Tuesday', 'Thursday'])
    const targetWeekdays = normalizedDays
      .map(weekdayStringToNumber)
      .filter((w): w is number => typeof w === 'number' && w >= 1 && w <= 7)
      .sort((a, b) => a - b);

    if (targetWeekdays.length > 0) {
      if (interval === 1) {
        // Daily: step 1 day at a time
        let current = startDate;
        while (current <= expiryDate && dates.length < maxVisits) {
          if (targetWeekdays.includes(current.weekday)) {
            dates.push(current);
          }
          current = current.plus({ days: 1 });
        }
      } else {
        // Step cycle-by-cycle (e.g. weekly, fortnightly, monthly, quarterly)
        let cycleWeekStart = startDate.startOf('week');

        while (cycleWeekStart <= expiryDate && dates.length < maxVisits) {
          for (const weekday of targetWeekdays) {
            const visitDate = cycleWeekStart.plus({ days: weekday - 1 });
            if (visitDate >= startDate && visitDate <= expiryDate) {
              dates.push(visitDate);
            }
          }

          if (plusConfig.months) {
            cycleWeekStart = cycleWeekStart
              .plus({ months: plusConfig.months })
              .startOf('week');
          } else {
            cycleWeekStart = cycleWeekStart.plus(plusConfig);
          }
        }
      }
    }
  } else {
    // No specific collectionDayOfWeek: step forward by interval
    let current = startDate;
    while (current <= expiryDate && dates.length < maxVisits) {
      dates.push(current);
      current = current.plus(plusConfig);
    }
  }

  // Every repeating plan collects on its start date, even when that isn't a
  // preferred day. The recurring dates above stay as they are.
  if (!dates.some((d) => d.hasSame(startDate, 'day'))) {
    dates.push(startDate);
  }

  // Ensure unique and chronologically sorted
  const sortedDates = dates.sort((a, b) => a.toMillis() - b.toMillis());

  if (options?.fromDate) {
    return sortedDates.filter((d) => d >= options.fromDate!);
  }

  return sortedDates;
}
