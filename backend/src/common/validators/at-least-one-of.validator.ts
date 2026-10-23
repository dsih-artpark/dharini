import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Class decorator requiring at least one of `properties` to be present.
 *
 * Why a *class* decorator and not a property one: `@IsOptional()` attaches a
 * conditional that skips every validator on that property when its value is
 * absent — including a custom one. Since "absent" is exactly the case being
 * checked, a property-level version silently never fires. Registering against
 * a virtual property name sidesteps that, because nothing marks the virtual
 * property optional.
 *
 * The gap this closes: a DTO with two mutually-optional identity fields
 * (email OR phone) accepts a request supplying neither, and the handler then
 * looks a user up by two undefined values — which, depending on how the query
 * is built, matches nothing or matches an arbitrary row.
 */
export function AtLeastOneOf(
  properties: string[],
  validationOptions?: ValidationOptions,
): ClassDecorator {
  return function (target: any) {
    registerDecorator({
      name: 'atLeastOneOf',
      target,
      propertyName: `__atLeastOneOf_${properties.join('_')}`,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const [required] = args.constraints as [string[]];
          return required.some((property) => {
            const candidate = (args.object as Record<string, unknown>)[
              property
            ];
            return (
              candidate !== undefined && candidate !== null && candidate !== ''
            );
          });
        },
        defaultMessage(args: ValidationArguments) {
          const [required] = args.constraints as [string[]];
          return `At least one of ${required.join(', ')} must be provided`;
        },
      },
    });
  };
}
