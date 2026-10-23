import { NestFactory } from '@nestjs/core';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { AppModule } from '../app.module';
import {
  createOpenApiDocument,
  OPENAPI_EXPORT_SERVER_URL,
} from './openapi.config';

// Writes the OpenAPI spec to docs/public/openapi/openapi.json without starting
// the server. Run it with `npm run openapi:generate`, which builds first: the
// @nestjs/swagger CLI plugin only adds DTO property metadata during `nest build`,
// so running this file through ts-node would produce empty schemas.
//
// Preview mode scans modules and controllers but never instantiates providers,
// so no PostgreSQL, Redis or BullMQ connections are opened.
const DEFAULT_OUTPUT = '../docs/public/openapi/openapi.json';

async function generate() {
  const output = resolve(process.cwd(), process.argv[2] ?? DEFAULT_OUTPUT);

  const app = await NestFactory.create(AppModule, {
    preview: true,
    abortOnError: false,
    logger: ['error'],
  });
  const document = createOpenApiDocument(app, OPENAPI_EXPORT_SERVER_URL);
  await app.close();

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`OpenAPI spec written to ${output}`);
}

generate().catch((err) => {
  console.error('OpenAPI generation failed:', err);
  process.exit(1);
});
