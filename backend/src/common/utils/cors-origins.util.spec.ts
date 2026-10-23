import { isLocalhostOrigin, parseCorsOrigins } from './cors-origins.util';

describe('parseCorsOrigins', () => {
  it('returns an empty list when unset or blank', () => {
    expect(parseCorsOrigins(undefined)).toEqual([]);
    expect(parseCorsOrigins('')).toEqual([]);
    expect(parseCorsOrigins(' , ')).toEqual([]);
  });

  it('splits a comma-separated list and trims whitespace', () => {
    expect(
      parseCorsOrigins(
        ' https://demo.dharini.artpark.ai , https://in.dharini.artpark.ai',
      ),
    ).toEqual([
      'https://demo.dharini.artpark.ai',
      'https://in.dharini.artpark.ai',
    ]);
  });

  it('normalises case, trailing slashes and default ports to match an Origin header', () => {
    expect(
      parseCorsOrigins(
        'HTTPS://Demo.Dharini.Artpark.ai/,https://in.dharini.artpark.ai:443',
      ),
    ).toEqual([
      'https://demo.dharini.artpark.ai',
      'https://in.dharini.artpark.ai',
    ]);
  });

  it('keeps non-default ports', () => {
    expect(parseCorsOrigins('http://localhost:3000')).toEqual([
      'http://localhost:3000',
    ]);
  });

  it.each([
    ['*'],
    ['demo.dharini.artpark.ai'],
    ['https://demo.dharini.artpark.ai/app'],
    ['https://demo.dharini.artpark.ai?x=1'],
    ['ftp://demo.dharini.artpark.ai'],
    ['https://user:pass@demo.dharini.artpark.ai'],
  ])('rejects %s', (entry) => {
    expect(() => parseCorsOrigins(entry)).toThrow(/CORS_ORIGINS/);
  });
});

describe('isLocalhostOrigin', () => {
  it.each([
    'http://localhost:3000',
    'http://localhost:54123',
    'http://127.0.0.1:3002',
  ])('accepts %s', (origin) => {
    expect(isLocalhostOrigin(origin)).toBe(true);
  });

  it.each([
    'https://demo.dharini.artpark.ai',
    'http://localhost.evil.example',
    'http://192.168.1.10:3000',
    'null',
  ])('rejects %s', (origin) => {
    expect(isLocalhostOrigin(origin)).toBe(false);
  });
});
