import { HttpService } from '@nestjs/axios';
import {
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { MlService } from './ml.service';

function upstream(status: number, body = '{}', headers = {}) {
  return of({
    data: Buffer.from(body),
    status,
    statusText: '',
    headers: { 'content-type': 'application/json', ...headers },
    config: {} as any,
  });
}

function fakeReq(method = 'GET', body?: unknown, acceptEncoding?: string) {
  return {
    method,
    body,
    headers: acceptEncoding ? { 'accept-encoding': acceptEncoding } : {},
  } as any;
}

function fakeRes() {
  const res: any = {
    setHeader: jest.fn(),
    send: jest.fn(),
  };
  res.status = jest.fn().mockReturnValue(res);
  return res;
}

describe('MlService', () => {
  let httpService: { request: jest.Mock };
  let configValues: Record<string, string | undefined>;

  const buildService = async (): Promise<MlService> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MlService,
        {
          provide: ConfigService,
          useValue: { get: (key: string) => configValues[key] },
        },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();
    return module.get(MlService);
  };

  beforeEach(() => {
    httpService = { request: jest.fn() };
    configValues = {
      ML_SERVICE_URL: 'https://ml.example',
      ML_API_KEY: 'test-key',
    };
  });

  describe('when ML is not configured', () => {
    it.each([
      ['no URL', { ML_SERVICE_URL: undefined }],
      ['no key', { ML_API_KEY: '' }],
      ['blank URL', { ML_SERVICE_URL: '   ' }],
    ])('is disabled with %s and answers 404', async (_, overrides) => {
      Object.assign(configValues, overrides);
      const service = await buildService();

      expect(service.enabled).toBe(false);
      await expect(
        service.forward(fakeReq(), fakeRes(), '/health'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(httpService.request).not.toHaveBeenCalled();
    });
  });

  it('calls the ML service with the key, the query string and the caller’s Accept-Encoding', async () => {
    httpService.request.mockReturnValue(upstream(200));
    const service = await buildService();

    await service.forward(
      fakeReq('GET', undefined, 'gzip, br'),
      fakeRes(),
      '/api/v1/birds/point/species?lat=12.97&lon=77.59&week=3',
    );

    const [config] = httpService.request.mock.calls[0];
    expect(config.url).toBe(
      'https://ml.example/api/v1/birds/point/species?lat=12.97&lon=77.59&week=3',
    );
    expect(config.method).toBe('GET');
    expect(config.headers['X-API-Key']).toBe('test-key');
    expect(config.headers['Accept-Encoding']).toBe('gzip, br');
    // gzip is passed through as bytes, never unpacked here
    expect(config.decompress).toBe(false);
    expect(config.responseType).toBe('arraybuffer');
  });

  it('sends the JSON body on POST', async () => {
    httpService.request.mockReturnValue(upstream(200));
    const service = await buildService();
    const body = { date: '2026-09-15', locations: [{ lat: 22.3, lon: 73.2 }] };

    await service.forward(
      fakeReq('POST', body),
      fakeRes(),
      '/api/v1/diseases/lsd/predict',
    );

    expect(httpService.request.mock.calls[0][0].data).toEqual(body);
  });

  it('relays status, body and compression headers unchanged', async () => {
    httpService.request.mockReturnValue(
      upstream(422, '{"detail":"bad week"}', {
        'content-encoding': 'gzip',
        vary: 'Accept-Encoding',
        'x-internal': 'not forwarded',
      }),
    );
    const service = await buildService();
    const res = fakeRes();

    await service.forward(fakeReq(), res, '/api/v1/birds/species');

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send.mock.calls[0][0].toString()).toBe('{"detail":"bad week"}');
    expect(res.setHeader).toHaveBeenCalledWith('content-encoding', 'gzip');
    expect(res.setHeader).toHaveBeenCalledWith('vary', 'Accept-Encoding');
    expect(res.setHeader).not.toHaveBeenCalledWith(
      'x-internal',
      expect.anything(),
    );
  });

  it('relays a busy answer (503 with Retry-After) so the UI can retry', async () => {
    httpService.request.mockReturnValue(
      upstream(503, '{"detail":"busy"}', { 'retry-after': '5' }),
    );
    const service = await buildService();
    const res = fakeRes();

    await service.forward(fakeReq(), res, '/api/v1/birds/species');

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.setHeader).toHaveBeenCalledWith('retry-after', '5');
  });

  it('turns a rejected key (401) into 503, so the frontend doesn’t log the user out', async () => {
    httpService.request.mockReturnValue(upstream(401));
    const logged = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const service = await buildService();

    await expect(
      service.forward(fakeReq(), fakeRes(), '/api/v1/birds/species'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(logged).toHaveBeenCalledWith(expect.stringContaining('ML_API_KEY'));
    logged.mockRestore();
  });

  it('answers 503 when the ML service is unreachable', async () => {
    httpService.request.mockReturnValue(
      throwError(() => new Error('connect ECONNREFUSED')),
    );
    const service = await buildService();

    await expect(
      service.forward(fakeReq(), fakeRes(), '/api/v1/birds/species'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it.each(['/docs', '/openapi.json', '/api/v1/../docs', '/api/v2/x'])(
    'refuses paths outside the ML API (%s)',
    async (path) => {
      const service = await buildService();

      await expect(
        service.forward(fakeReq(), fakeRes(), path),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(httpService.request).not.toHaveBeenCalled();
    },
  );
});
