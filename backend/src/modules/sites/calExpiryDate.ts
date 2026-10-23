import { DateTime } from 'luxon';

// Last moment of a collection plan: `durationInDays` after its start date, at
// 23:59:59. Falls back to today only when there is no usable start date.
// Callers pass the start date the way they store it ('yyyy-MM-dd HH:mm:ss', no
// zone), so it is read as a calendar day in the same zone they format the
// result in.
export function calculateExpiryDateFlexible(
  durationInDays: number,
  collectionTime: string,
  startDate?: Date | string | null,
): Date {
  const start = parseStartDate(startDate) ?? DateTime.now();
  console.log(collectionTime);
  const expiryDate = start.plus({ days: durationInDays }).set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 0,
  });
  return expiryDate.toJSDate();
}

function parseStartDate(startDate?: Date | string | null): DateTime | null {
  if (!startDate) return null;
  const parsed =
    startDate instanceof Date
      ? DateTime.fromJSDate(startDate)
      : DateTime.fromFormat(startDate, 'yyyy-MM-dd HH:mm:ss');
  return parsed.isValid ? parsed : null;
}
