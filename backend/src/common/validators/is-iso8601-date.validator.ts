import { registerDecorator, ValidationOptions } from 'class-validator';

// Matches YYYY-MM-DD, optionally with a T + time + optional timezone (full ISO 8601).
const ISO8601_REGEX =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function isValidCalendarDate(value: string): boolean {
  const datePart = value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  // Guard against JS Date rolling over invalid days (e.g. 2021-02-30 -> 2021-03-02).
  return date.toISOString().slice(0, 10) === datePart || value.length > 10;
}

/**
 * Validates that a string is a real calendar date in strict ISO 8601 format
 * (YYYY-MM-DD, optionally with a time component), rejecting other formats
 * (e.g. DD/MM/YYYY, MM-DD-YYYY) that silently misparse across locales.
 */
export function IsIso8601Date(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIso8601Date',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a valid ISO 8601 date (YYYY-MM-DD)`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          if (!ISO8601_REGEX.test(value)) return false;
          return isValidCalendarDate(value);
        },
      },
    });
  };
}
