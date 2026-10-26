import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { MlThrottlerGuard } from './ml-throttler.guard';
import { MlService } from './ml.service';

const ML_DOCS =
  'Relayed to the dharini-ml prediction service, whose API reference ' +
  '(paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. ' +
  'Any logged-in user may call it. Returns 404 when ML is not enabled on ' +
  'this server, 503 when the ML service is unavailable or busy.';

/**
 * ML predictions for logged-in users, relayed to the dharini-ml service:
 * `/ml/<path>` here is `/api/v1/<path>` there. The global JwtAuthGuard
 * protects every route; the ML API key is added server-side.
 */
@ApiTags('ML predictions')
@ApiBearerAuth()
@UseGuards(MlThrottlerGuard)
@Throttle({ default: { limit: 120, ttl: 60_000 } }) // per user, per minute
@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Whether ML predictions are enabled, and which models are loaded',
    description:
      'The UI shows ML features only when this returns 200. 404: not enabled on this server.',
  })
  status(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, '/health');
  }

  @Get('birds/*path')
  @ApiOperation({
    summary: 'Bird migration predictions (species, maps, seasons)',
    description: ML_DOCS,
  })
  birds(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, toMlPath(req));
  }

  // POST because a place is a body (boundary polygon, or centre + radius),
  // not a query string: /ml/birds/place/summary, /ml/birds/place/all-species,
  // /ml/birds/place/species/{key}.
  @Post('birds/place/*path')
  @ApiOperation({
    summary: 'Bird forecasts for a place (boundary or centre + radius)',
    description: ML_DOCS,
  })
  birdsPlace(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, toMlPath(req));
  }

  @Get('diseases')
  @ApiOperation({
    summary: 'Livestock disease models available (LSD today)',
    description: ML_DOCS,
  })
  diseases(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, toMlPath(req));
  }

  @Get('diseases/:disease')
  @ApiOperation({ summary: 'One disease model', description: ML_DOCS })
  disease(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, toMlPath(req));
  }

  @Post('diseases/:disease/predict')
  @ApiOperation({
    summary: 'Disease risk at up to 50 locations on a date',
    description: ML_DOCS,
  })
  predictDisease(@Req() req: Request, @Res() res: Response) {
    return this.mlService.forward(req, res, toMlPath(req));
  }
}

/** `/ml/birds/species?x=1` here is `/api/v1/birds/species?x=1` on the ML service. */
export function toMlPath(req: Pick<Request, 'originalUrl'>): string {
  return req.originalUrl.replace(/^\/ml\//, '/api/v1/');
}
