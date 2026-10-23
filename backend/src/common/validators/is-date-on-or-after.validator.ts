import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that this ISO 8601 date field is on or after another ISO 8601
 * date field on the same object (e.g. sampleReceivedDate >= visitOrCollectionDate).
 */
export function IsDateOnOrAfter(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateOnOrAfter',
      target: object.constructor,
      propertyName,
      constraints: [relatedPropertyName],
      options: {
        message: `${propertyName} must be on or after ${relatedPropertyName}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedProperty
          ];
          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return true; // let @IsIso8601Date on each field report format errors
          }
          const current = new Date(value);
          const related = new Date(relatedValue);
          if (
            Number.isNaN(current.getTime()) ||
            Number.isNaN(related.getTime())
          ) {
            return true;
          }
          return current.getTime() >= related.getTime();
        },
      },
    });
  };
}
