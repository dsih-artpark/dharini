import { toMlPath } from './ml.controller';
import { MlThrottlerGuard } from './ml-throttler.guard';

describe('toMlPath', () => {
  it.each([
    ['/ml/birds/species', '/api/v1/birds/species'],
    [
      '/ml/birds/point/species?lat=12.97&lon=77.59&week=3',
      '/api/v1/birds/point/species?lat=12.97&lon=77.59&week=3',
    ],
    ['/ml/birds/place/summary', '/api/v1/birds/place/summary'],
    ['/ml/birds/place/all-species', '/api/v1/birds/place/all-species'],
    ['/ml/diseases', '/api/v1/diseases'],
    ['/ml/diseases/lsd/predict', '/api/v1/diseases/lsd/predict'],
  ])('maps %s to %s', (originalUrl, expected) => {
    expect(toMlPath({ originalUrl })).toBe(expected);
  });
});

describe('MlThrottlerGuard', () => {
  // getTracker only reads the request, so no throttler storage is needed.
  const guard = Object.create(MlThrottlerGuard.prototype) as MlThrottlerGuard;
  const track = (req: Record<string, any>) =>
    (guard as any).getTracker(req) as Promise<string>;

  it('counts per logged-in user, not per IP', async () => {
    expect(await track({ user: { id: 'u-1' }, ip: '10.0.0.1' })).toBe(
      'user:u-1',
    );
    expect(await track({ user: { id: 'u-2' }, ip: '10.0.0.1' })).toBe(
      'user:u-2',
    );
  });

  it('falls back to the IP without a user', async () => {
    expect(await track({ ip: '10.0.0.1' })).toBe('10.0.0.1');
  });
});
