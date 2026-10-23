import { formatIndianPhoneNumber } from './format-phone-number';

describe('formatIndianPhoneNumber', () => {
  it('prefixes a bare 10-digit number with +91', () => {
    expect(formatIndianPhoneNumber('8334023456')).toBe('+918334023456');
  });

  it('leaves a number that already carries the 91 country code alone', () => {
    expect(formatIndianPhoneNumber('918334023456')).toBe('+918334023456');
  });
});
