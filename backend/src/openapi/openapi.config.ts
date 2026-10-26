import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { version } from '../../package.json';

// Server URL written into the committed spec (docs/public/openapi/openapi.json).
// nginx proxies /api/ to the backend, so this is correct on every deployment
// without baking in a hostname.
export const OPENAPI_EXPORT_SERVER_URL = '/api';

// Single definition of the OpenAPI document, shared by the live Swagger UI
// (main.ts) and the static export (generate-openapi.ts) so the two can't drift.
export function createOpenApiDocument(
  app: INestApplication,
  serverUrl: string | undefined,
): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Dharini API')
    .setDescription('API for the Dharini Platform')
    .setVersion(version)
    .addServer(serverUrl)
    .addBearerAuth()
    .build();

  return SwaggerModule.createDocument(app, config);
}
