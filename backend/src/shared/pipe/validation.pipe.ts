import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, { stopAtFirstError: true }); // Stops at first error

    if (errors.length > 0) {
      const firstError = errors[0]; // Get the first encountered error
      // A nested validation failure (@ValidateNested) reports `children` and
      // leaves `constraints` undefined, so reading Object.values() off it blew
      // up here and turned a 400 into a 500 that named no field.
      const firstErrorMessage =
        Object.values(firstError.constraints ?? {})[0] ??
        'Validation failed for the request payload';

      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: firstErrorMessage,
        timestamp: new Date().toISOString(),
        path: firstError.property, // Name of the field that caused the error
      });
    }

    // FIX-PLAN A6 (part 2 of 2): return the plainToInstance()-transformed
    // object that was actually validated above, not the raw unvalidated
    // `value`. Safe on its own with no `whitelist` option set: plainToInstance
    // still carries every property of `value` onto `object` (nothing is
    // dropped), it just also applies real type coercion (@Type/@Transform,
    // enum/Date conversion, nested class instances for @ValidateNested) that
    // `validate()` above already assumed was in effect. Handlers now receive
    // what was actually checked instead of a copy that silently diverges
    // from it.
    //
    // Deliberately NOT adding `whitelist: true` here (that's the other half
    // of A6, and it is NOT safe yet): 17+ properties across live request
    // DTOs have no class-validator decorator at all (e.g.
    // visits/dto/create-visit.dto.ts `projectId`,
    // samples/dto/create-sample.dto.ts `project`/`latitude`/`longitude`,
    // sites/dto/create-site.dto.ts `project`, teams/dto/*.ts `project`/
    // `teamId`/`memberId`/`members`, lab-tests/dto/create-lab-test.dto.ts
    // `testedBy`/`sample`, projects/dto/upload-sample-data.dto.ts `user`).
    // `whitelist: true` strips exactly those, silently, with no 400 - several
    // are load-bearing tenant/identity fields, so creation flows would start
    // writing rows with a null project/team instead of erroring. Those
    // properties need a `@IsX()` (or at minimum `@Allow()`) decorator added
    // in their owning modules before `whitelist: true` (and, later,
    // `forbidNonWhitelisted`) can be turned on safely. That's a follow-up
    // change spanning modules this branch doesn't otherwise touch, not
    // something to slip in here.
    return object;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: Array<new (...args: any[]) => any> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
