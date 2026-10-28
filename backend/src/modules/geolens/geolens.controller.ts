import {
  Controller,
  Get,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import {
  AnyAuthenticated,
  CheckPolicies,
} from 'src/common/decorators/check-policy.decorator';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import {
  ServiceScoped,
  TenantAgnostic,
} from 'src/common/decorators/tenant-scope.decorator';
import { GeoLensService } from './geolens.service';

// Every route here was previously unauthenticated. Most serve genuinely global
// biodiversity reference layers or proxy a third-party API, but `GET
// /geolens/sites` returned the name and GPS coordinates of every site in the
// database to anyone who asked - across every workspace, with no login. The
// controller now requires a JWT throughout; `sites` is additionally scoped to
// the caller's own projects in the service.
@ApiTags('GeoLens')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@TenantAgnostic()
@CheckPolicies(AnyAuthenticated)
@Controller('geolens')
export class GeoLensController {
  constructor(private readonly geoLensService: GeoLensService) {}

  // ── Wetlands ────────────────────────────────────────────────────────────

  @Get('wetlands/states')
  @ApiOperation({ summary: 'Get all unique wetland states' })
  async getWetlandStates() {
    const states = await this.geoLensService.getWetlandStates();
    return { success: true, data: states };
  }

  @Get('wetlands')
  @ApiOperation({ summary: 'Get wetlands filtered by state/district' })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'district', required: false })
  async getWetlands(
    @Query('state') state?: string,
    @Query('district') district?: string,
  ) {
    const data = await this.geoLensService.getWetlands(state, district);
    return { success: true, count: data.length, data };
  }

  @Get('wetlands/csv')
  @ApiOperation({
    summary: 'Get wetlands in CSV-compatible format (for frontend)',
  })
  @ApiQuery({ name: 'state', required: false })
  async getWetlandsCsv(@Query('state') state?: string) {
    const data = await this.geoLensService.getWetlandsCsv(state);
    return { success: true, count: data.length, data };
  }

  // ── Poultry Farms ───────────────────────────────────────────────────────

  @Get('poultry-farms')
  @ApiOperation({ summary: 'Get poultry farms, optionally by state' })
  @ApiQuery({ name: 'state', required: false })
  async getPoultryFarms(@Query('state') state?: string) {
    const data = await this.geoLensService.getPoultryFarms(state);
    return { success: true, count: data.length, data };
  }

  @Get('poultry-farms/csv')
  @ApiOperation({
    summary: 'Get all poultry farms in CSV-compatible format',
  })
  async getPoultryFarmsCsv() {
    const data = await this.geoLensService.getPoultryFarmsCsv();
    return { success: true, count: data.length, data };
  }

  // ── Cattle Markets ──────────────────────────────────────────────────────

  @Get('cattle-markets')
  @ApiOperation({ summary: 'Get cattle markets, optionally by state' })
  @ApiQuery({ name: 'state', required: false })
  async getCattleMarkets(@Query('state') state?: string) {
    const data = await this.geoLensService.getCattleMarkets(state);
    return { success: true, count: data.length, data };
  }

  // ── Water Boundaries (GeoJSON) ──────────────────────────────────────────

  @Get('water-boundaries')
  @ApiOperation({
    summary: 'Get water boundaries as GeoJSON (optionally filtered by bbox)',
  })
  @ApiQuery({
    name: 'minLng',
    required: false,
    description: 'Bounding box min longitude',
  })
  @ApiQuery({
    name: 'minLat',
    required: false,
    description: 'Bounding box min latitude',
  })
  @ApiQuery({
    name: 'maxLng',
    required: false,
    description: 'Bounding box max longitude',
  })
  @ApiQuery({
    name: 'maxLat',
    required: false,
    description: 'Bounding box max latitude',
  })
  async getWaterBoundaries(
    @Query('minLng') minLng?: string,
    @Query('minLat') minLat?: string,
    @Query('maxLng') maxLng?: string,
    @Query('maxLat') maxLat?: string,
  ) {
    const bbox =
      minLng && minLat && maxLng && maxLat
        ? {
            minLng: parseFloat(minLng),
            minLat: parseFloat(minLat),
            maxLng: parseFloat(maxLng),
            maxLat: parseFloat(maxLat),
          }
        : undefined;

    const data = await this.geoLensService.getWaterBoundariesGeoJson(bbox);
    return {
      success: true,
      count: data.features.length,
      data,
    };
  }

  @Get('water-boundaries/simplified')
  @ApiOperation({
    summary:
      'Get simplified water boundaries (ST_Simplify) for faster map rendering',
  })
  @ApiQuery({ name: 'minLng', required: false })
  @ApiQuery({ name: 'minLat', required: false })
  @ApiQuery({ name: 'maxLng', required: false })
  @ApiQuery({ name: 'maxLat', required: false })
  @ApiQuery({ name: 'zoom', required: false })
  async getWaterBoundariesSimplified(
    @Query('minLng') minLng?: string,
    @Query('minLat') minLat?: string,
    @Query('maxLng') maxLng?: string,
    @Query('maxLat') maxLat?: string,
    @Query('zoom') zoom?: string,
  ) {
    const bbox =
      minLng && minLat && maxLng && maxLat
        ? {
            minLng: parseFloat(minLng),
            minLat: parseFloat(minLat),
            maxLng: parseFloat(maxLng),
            maxLat: parseFloat(maxLat),
          }
        : undefined;

    const data = await this.geoLensService.getWaterBoundariesSimplified(
      bbox,
      zoom ? parseInt(zoom, 10) : undefined,
    );
    return {
      success: true,
      count: data.features.length,
      data,
    };
  }

  // ── Sites & Diseases ────────────────────────────────────────────────────

  @Get('sites')
  @ServiceScoped(
    'getSites() filters to the caller reachable projects, narrowed to ?workspaceId when given',
  )
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'site'))
  @ApiOperation({ summary: 'Get sites the caller can see, with locations' })
  @ApiQuery({
    name: 'workspaceId',
    required: false,
    description:
      'Only sites in this workspace (the one selected in the UI). Narrows the caller’s access; never widens it.',
  })
  async getSites(
    @Req() req,
    @Query('workspaceId', new ParseUUIDPipe({ optional: true }))
    workspaceId?: string,
  ) {
    const data = await this.geoLensService.getSites(req.user, workspaceId);
    return { success: true, count: data.length, data };
  }

  @Get('diseases')
  @ApiOperation({ summary: 'Get all diseases' })
  async getDiseases() {
    const data = await this.geoLensService.getDiseases();
    return { success: true, count: data.length, data };
  }

  // ── eBird API Proxy ──────────────────────────────────────────────────────

  @Get('ebird')
  @ApiOperation({ summary: 'Get eBird observations from backend proxy' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'dist', required: false, type: Number })
  @ApiQuery({ name: 'back', required: false, type: Number })
  async getEbirdObservations(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('dist') dist?: string,
    @Query('back') back?: string,
  ) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const distNum = dist ? parseFloat(dist) : undefined;
    const backNum = back ? parseInt(back, 10) : undefined;

    // console.log('eBird proxy called with', { lat, lng, dist, back });
    const result = await this.geoLensService.getEbirdObservations(
      latNum,
      lngNum,
      distNum,
      backNum,
    );
    console.log('eBird service returned', result?.length ?? 0, 'records');
    return { success: true, count: result?.length ?? 0, data: result };
  }

  // ── Weather API Proxy ───────────────────────────────────────────────────

  @Get('weather')
  @ApiOperation({ summary: 'Get current weather from backend proxy' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  async getWeather(@Query('lat') lat: string, @Query('lng') lng: string) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const result = await this.geoLensService.getWeather(latNum, lngNum);
    return { success: true, data: result };
  }

  @Get('weather/historical')
  @ApiOperation({ summary: 'Get historical weather from backend proxy' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  async getHistoricalWeather(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const result = await this.geoLensService.getHistoricalWeather(
      latNum,
      lngNum,
    );
    return { success: true, data: result };
  }
}
