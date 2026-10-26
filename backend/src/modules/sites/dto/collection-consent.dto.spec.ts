import { DECORATORS } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSiteDto } from './create-site.dto';
import { UpdateSiteDto } from './update-site.dto';

/**
 * collectionConsent travels as the string 'true' or 'false'. Its OpenAPI
 * pattern is set on the DTO, because the Swagger plugin would copy the
 * @Matches regex literal into the spec with its slashes.
 */
describe.each([
  ['CreateSiteDto', CreateSiteDto],
  ['UpdateSiteDto', UpdateSiteDto],
])('%s.collectionConsent', (_, Dto) => {
  const consentErrors = async (collectionConsent: unknown) => {
    const errors = await validate(plainToInstance(Dto, { collectionConsent }));
    return errors.filter((error) => error.property === 'collectionConsent');
  };

  it('documents the pattern it validates, without regex delimiters', () => {
    const property = Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES,
      Dto.prototype,
      'collectionConsent',
    );

    expect(property.pattern).toBe('^(true|false)$');
  });

  it.each(['true', 'false', null, undefined])('accepts %p', async (value) => {
    expect(await consentErrors(value)).toEqual([]);
  });

  it.each(['yes', 'TRUE', '', true])('refuses %p', async (value) => {
    expect(await consentErrors(value)).toHaveLength(1);
  });
});
