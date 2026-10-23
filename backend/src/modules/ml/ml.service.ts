import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosResponse } from 'axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

/**
 * The ML service answers within 45 s (disease risk waits on live weather);
 * nginx in front of Dharini gives up at 60 s.
 */
const ML_TIMEOUT_MS = 55_000;

/** ML response headers passed back to the browser. */
const FORWARDED_HEADERS = [
  'content-type',
  'content-encoding',
  'vary',
  'retry-after',
];

/**
 * Client for the dharini-ml prediction service (bird migration, livestock
 * disease risk): a separate deployment that Dharini's backend calls
 * server-to-server, so its API key never reaches the browser.
 *
 * Env vars (both optional; ML features are off unless both are set):
 *  - ML_SERVICE_URL: base URL of the ML service.
 *  - ML_API_KEY: this deployment's key for it, sent as `X-API-Key`.
 */
@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly baseUrl?: string;
  private readonly apiKey?: string;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl =
      configService.get<string>('ML_SERVICE_URL')?.trim() || undefined;
    this.apiKey = configService.get<string>('ML_API_KEY')?.trim() || undefined;
  }

  get enabled(): boolean {
    return Boolean(this.baseUrl && this.apiKey);
  }

  /**
   * Relays a request to the ML service and its answer back unchanged: status
   * (so 4xx validation errors reach the UI as they are), body and compression
   * (gzip passes through rather than being unpacked and packed again).
   *
   * `mlPath` is the ML service path, including any query string, e.g.
   * `/api/v1/birds/point/species?lat=12.97&lon=77.59&week=3`.
   */
  async forward(req: Request, res: Response, mlPath: string): Promise<void> {
    if (!this.enabled) {
      throw new NotFoundException(
        'ML predictions are not enabled on this server',
      );
    }
    const url = new URL(mlPath, this.baseUrl);
    // Only the ML API and its health check are reachable through Dharini.
    if (!url.pathname.startsWith('/api/v1/') && url.pathname !== '/health') {
      throw new NotFoundException();
    }

    let upstream: AxiosResponse<ArrayBuffer>;
    try {
      upstream = await firstValueFrom(
        this.httpService.request<ArrayBuffer>({
          url: url.toString(),
          method: req.method,
          data: req.method === 'POST' ? req.body : undefined,
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept-Encoding': req.headers['accept-encoding'] ?? 'identity',
          },
          responseType: 'arraybuffer',
          decompress: false,
          maxRedirects: 0,
          timeout: ML_TIMEOUT_MS,
          validateStatus: () => true, // every status is relayed, not thrown
        }),
      );
    } catch (err) {
      this.logger.warn(`ML service unreachable: ${err?.message ?? err}`);
      throw new ServiceUnavailableException(
        'ML prediction service is unavailable',
      );
    }

    // A 401 here means the ML service rejected this server's key: a
    // configuration problem, not the user's. Passing it on would make the
    // frontend treat it as an expired session and log the user out.
    if (upstream.status === 401) {
      this.logger.error(
        'The ML service rejected ML_API_KEY; it must match this deployment’s key on the ML server',
      );
      throw new ServiceUnavailableException(
        'ML prediction service is unavailable',
      );
    }

    for (const name of FORWARDED_HEADERS) {
      const value = upstream.headers[name];
      if (value !== undefined && value !== null) res.setHeader(name, value);
    }
    res.status(upstream.status).send(Buffer.from(upstream.data));
  }
}
