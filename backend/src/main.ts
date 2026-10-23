import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import type { IncomingMessage } from 'http';
import { AppDataSource } from '../ormconfig';
import { AppModule } from './app.module';
import { ErrorHandlingService } from './common/service/errorHandle.service';
import {
  isLocalhostOrigin,
  parseCorsOrigins,
} from './common/utils/cors-origins.util';
import { createOpenApiDocument } from './openapi/openapi.config';
import { SeederService } from './seeder/seederService';
import {
  AllExceptionsFilter,
  ForbiddenFilter,
  QueryExceptionFilter,
} from './shared/filters/http-exception.filter';
import { ValidationPipe } from './shared/pipe/validation.pipe';

async function bootstrap() {
  // Catch uncaught exceptions to prevent server crashes under socket EPIPE or network errors
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception captured:', err);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error(
      'Unhandled Rejection captured at:',
      promise,
      'reason:',
      reason,
    );
  });

  // Load .env first
  dotenv.config();

  // Only run migrations in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    try {
      const connection = await AppDataSource.initialize();
      console.log('Running pending migrations...');
      await connection.runMigrations();
      console.log('Migrations completed.');
    } catch (err) {
      console.error('Migration failed', err);
      process.exit(1);
    }
  } else {
    console.log(
      'Development mode: Skipping AppDataSource initialization and migrations (using TypeORM synchronize instead)',
    );
  }
  const app = await NestFactory.create(AppModule);
  // Security headers. Registered first so every response gets them — body
  // parser errors, exception-filter output, and Swagger, whose routes
  // SwaggerModule.setup mounts directly on express (anything registered after
  // it would skip /docs). Helmet also removes X-Powered-By.
  app.use(
    helmet({
      contentSecurityPolicy: {
        // Helmet's default directives are kept; Swagger UI loads its scripts
        // from 'self' and only needs the inline styles they already allow.
        directives: {
          frameAncestors: ["'none'"],
          // Would rewrite /docs asset URLs to https and blank the page on
          // HTTP-only (server IP) deployments.
          upgradeInsecureRequests: null,
        },
      },
      // Nothing here needs cross-origin isolation; enabling it only risks /docs.
      crossOriginEmbedderPolicy: false,
      // The API shares its hostname with the frontend, /apk and /s3 behind
      // nginx, so HSTS already covers all of them; don't extend it to
      // subdomains we don't control.
      strictTransportSecurity: { maxAge: 31536000, includeSubDomains: false },
      xFrameOptions: { action: 'deny' },
    }),
  );
  // `verify` is how the pipeline webhook's raw bytes are captured for HMAC
  // verification. Nest's `rawBody: true` option cannot be used here: the express
  // adapter skips registering its own parser when a `jsonParser` middleware is
  // already on the stack, which this call is — so the option is silently ignored.
  app.use(
    json({
      limit: '50mb',
      verify: (
        req: IncomingMessage & { rawBody?: Buffer },
        _res,
        buf: Buffer,
      ) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  if (process.env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
      console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  // Configure CORS: only browser origins listed in CORS_ORIGINS may call the
  // API. Requests with no Origin header (native mobile app, server-side
  // Next.js, the pipeline webhook, health checks) aren't subject to CORS and
  // pass. In development, any localhost port is also allowed so `next dev` and
  // Flutter web work without extra config.
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  if (!isDevelopment && allowedOrigins.length === 0) {
    throw new Error(
      'CORS_ORIGINS must be set outside development, e.g. CORS_ORIGINS=https://demo.dharini.artpark.ai',
    );
  }
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        (isDevelopment && isLocalhostOrigin(origin));
      // `false` omits the CORS headers so the browser blocks the response;
      // passing an Error instead would turn it into a 500.
      callback(null, allowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const document = createOpenApiDocument(app, process.env.NEXT_PUBLIC_API_URL);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // ✅ Keeps the token after refresh
    },
  });

  // Seed data - Skip in development mode for now
  if (process.env.NODE_ENV !== 'development') {
    const seeder = app.get(SeederService);
    await seeder.seed();
  }

  console.log(process.env.QUEUE);
  // Apply the exception filter globally
  app.useGlobalFilters(new AllExceptionsFilter());
  const errorHandlingService = app.get(ErrorHandlingService);
  app.useGlobalFilters(new QueryExceptionFilter(errorHandlingService));
  app.useGlobalFilters(new ForbiddenFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 4000);

  // GeoLens map layers load after the API is up: on a fresh database that's
  // ~555k rows the API doesn't need in order to serve requests. It never
  // throws, but the catch keeps a surprise from becoming an unhandled rejection.
  if (process.env.NODE_ENV !== 'development') {
    app
      .get(SeederService)
      .seedGeoLens()
      .catch((err) => console.error('GeoLens seeding failed:', err));
  }
}

bootstrap();
// Trigger reload
