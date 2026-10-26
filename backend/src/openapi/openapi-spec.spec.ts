import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * The committed spec, which CI's openapi-check keeps identical to
 * `npm run openapi:generate`. The Swagger CLI plugin only adds DTO metadata
 * during `nest build`, so what it contributes is checked in its output.
 */
describe('docs/public/openapi/openapi.json', () => {
  const spec = JSON.parse(
    readFileSync(
      resolve(__dirname, '../../../docs/public/openapi/openapi.json'),
      'utf8',
    ),
  );
  const schemas = spec.components.schemas;

  const responseRefs = (path: string, method: string): string[] =>
    Object.values(spec.paths[path][method].responses).flatMap((response: any) =>
      Object.values(response.content ?? {}).map(
        (media: any) => media.schema?.$ref,
      ),
    );

  it.each(['CreateSiteDto', 'UpdateSiteDto'])(
    'gives %s.collectionConsent a pattern without regex delimiters',
    (dto) => {
      const { pattern } = schemas[dto].properties.collectionConsent;

      expect(pattern).toBe('^(true|false)$');
      expect(new RegExp(pattern).test('true')).toBe(true);
      expect(new RegExp(pattern).test('/true/')).toBe(false);
    },
  );

  it('keeps UserResponse as the full user the users endpoints return', () => {
    expect(schemas.UserResponse.properties.data).toEqual({
      $ref: '#/components/schemas/User',
    });
    for (const [path, method] of [
      ['/users', 'post'],
      ['/users/{id}', 'get'],
      ['/users/{id}', 'patch'],
      ['/users/{id}', 'delete'],
      ['/users/super-admins', 'post'],
      ['/users/super-admins/{id}', 'patch'],
    ]) {
      expect(responseRefs(path, method)).toContain(
        '#/components/schemas/UserResponse',
      );
    }
  });

  it("names the users module's summary response apart from UserResponse", () => {
    expect(schemas.UserSummaryResponse.properties.data).toEqual({
      $ref: '#/components/schemas/UserResponseType',
    });
  });
});
