import { DateTime } from 'luxon';

/**
 * Converts a day name string to Luxon weekday number (1=Monday, 7=Sunday)
 */
function dayNameToWeekday(day: string): number {
  const dayMap: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  return dayMap[day.toLowerCase()] ?? 1; // Default to Monday if unknown
}

/**
 * Calculates the start date based on the first day in the daysOfWeek array.
 * Returns the next occurrence of that day (or today if today is that day).
 */
export function calculateStartDate(
  daysOfWeek: string[],
  collectionTime: string,
): Date {
  console.log('Collection time:', collectionTime);
  console.log('Days of week:', daysOfWeek);

  const now = DateTime.now().startOf('day');

  // If no days provided, default to today
  if (!daysOfWeek || daysOfWeek.length === 0) {
    console.log('No days of week provided, using today');
    return now.toJSDate();
  }

  // Get the first day from the array and find its next occurrence
  const firstDay = daysOfWeek[0];
  const targetWeekday = dayNameToWeekday(firstDay);
  const currentWeekday = now.weekday; // Luxon: 1=Monday, 7=Sunday

  let daysToAdd = targetWeekday - currentWeekday;

  // If target day is today or in the past this week
  if (daysToAdd < 0) {
    daysToAdd += 7; // Move to next week
  }

  const startDate = now.plus({ days: daysToAdd });
  console.log(`Calculated start date: ${startDate.toISODate()} (${firstDay})`);

  return startDate.toJSDate();
}
