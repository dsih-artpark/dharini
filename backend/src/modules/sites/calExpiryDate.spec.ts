import { DateTime, Settings } from 'luxon';
import { calculateExpiryDateFlexible } from './calExpiryDate';

describe('calculateExpiryDateFlexible', () => {
  const realNow = Settings.now;
  const today = DateTime.fromObject({
    year: 2026,
    month: 10,
    day: 7,
    hour: 10,
  });

  beforeEach(() => {
    Settings.now = () => today.toMillis();
  });

  afterEach(() => {
    Settings.now = realNow;
  });

  // Callers format the result as a zone-less 'yyyy-MM-dd HH:mm:ss' string.
  const asStored = (date: Date) =>
    DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm:ss');

  it('counts the duration from a backdated start date, not from today', () => {
    expect(
      asStored(calculateExpiryDateFlexible(30, '09:00', '2026-09-07 00:00:00')),
    ).toBe('2026-10-07 23:59:59');
  });

  it('counts the duration from a future start date', () => {
    expect(
      asStored(calculateExpiryDateFlexible(30, '09:00', '2026-11-07 00:00:00')),
    ).toBe('2026-12-07 23:59:59');
  });

  it('falls back to today when there is no usable start date', () => {
    expect(asStored(calculateExpiryDateFlexible(30, '09:00'))).toBe(
      '2026-11-06 23:59:59',
    );
    expect(
      asStored(calculateExpiryDateFlexible(30, '09:00', 'not a date')),
    ).toBe('2026-11-06 23:59:59');
  });
});
