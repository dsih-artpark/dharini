import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { BioWetland } from 'src/entities/bio-wetland.entity';
import { BioPoultryFarm } from 'src/entities/bio-poultry-farm.entity';
import { BioWaterBoundary } from 'src/entities/bio-water-boundary.entity';
import { BioCattleMarket } from 'src/entities/bio-cattle-market.entity';
import { Site } from 'src/entities/site.entity';
import { Disease } from 'src/entities/disease.entity';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';

@Injectable()
export class GeoLensService {
  constructor(
    @InjectRepository(BioWetland)
    private wetlandRepo: Repository<BioWetland>,
    @InjectRepository(BioPoultryFarm)
    private poultryRepo: Repository<BioPoultryFarm>,
    @InjectRepository(BioWaterBoundary)
    private waterBoundaryRepo: Repository<BioWaterBoundary>,
    @InjectRepository(BioCattleMarket)
    private cattleMarketRepo: Repository<BioCattleMarket>,
    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    @InjectRepository(Disease)
    private diseaseRepo: Repository<Disease>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  // ── Wetlands ────────────────────────────────────────────────────────────

  /** Get all unique states */
  async getWetlandStates(): Promise<string[]> {
    const rows = await this.wetlandRepo
      .createQueryBuilder('w')
      .select('DISTINCT w.state', 'state')
      .orderBy('w.state', 'ASC')
      .getRawMany();
    return rows.map((r) => r.state);
  }

  /** Get wetlands filtered by state (and optionally district) */
  async getWetlands(state?: string, district?: string): Promise<BioWetland[]> {
    const qb = this.wetlandRepo.createQueryBuilder('w');
    if (state) qb.andWhere('LOWER(w.state) = LOWER(:state)', { state });
    if (district)
      qb.andWhere('LOWER(w.district) = LOWER(:district)', { district });
    qb.orderBy('w.name', 'ASC');
    return qb.getMany();
  }

  /** Get wetlands as CSV-compatible JSON (matching frontend Papa.parse format) */
  async getWetlandsCsv(state?: string): Promise<
    {
      'Sr. No.': number;
      State: string;
      District: string;
      'Central Longitude (DD)': number;
      'Central Latitude (DD)': number;
      'Wetland Name': string;
    }[]
  > {
    const qb = this.wetlandRepo.createQueryBuilder('w');
    if (state) qb.andWhere('LOWER(w.state) = LOWER(:state)', { state });
    const rows = await qb.getMany();
    return rows.map((w) => ({
      'Sr. No.': w.srNo,
      State: w.state,
      District: w.district,
      'Central Longitude (DD)': w.longitude,
      'Central Latitude (DD)': w.latitude,
      'Wetland Type Code': w.wetlandTypeCode,
      'Wetland Type Description': w.wetlandTypeDescription,
      'Wetland Area (Ha)': w.areaHa,
      'Wetland Name': w.name,
      'Status 2017-18 w.r.t. 2006-07': w.status,
    }));
  }

  // ── Poultry Farms ───────────────────────────────────────────────────────

  /** Get poultry farms, optionally filtered by state */
  async getPoultryFarms(
    state?: string,
  ): Promise<
    { name: string; lat: number; lng: number; state: string; city: string }[]
  > {
    const qb = this.poultryRepo.createQueryBuilder('p');
    if (state) qb.andWhere('LOWER(p.state) = LOWER(:state)', { state });
    qb.select([
      'p.id',
      'p.name',
      'p.latitude',
      'p.longitude',
      'p.state',
      'p.city',
      'p.address',
    ]);
    const rows = await qb.getMany();
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      lat: p.latitude,
      lng: p.longitude,
      state: p.state,
      city: p.city,
      address: p.address,
    }));
  }

  /** Get poultry farms as CSV-compatible JSON (matching frontend format) */
  async getPoultryFarmsCsv(): Promise<
    { name: string; lat: number; lng: number; state: string; city: string }[]
  > {
    const rows = await this.poultryRepo.find({
      select: ['name', 'latitude', 'longitude', 'state', 'city', 'address'],
    });
    return rows.map((p) => ({
      name: p.name,
      lat: p.latitude,
      lng: p.longitude,
      state: p.state,
      city: p.city,
      address: p.address,
    }));
  }

  // ── Cattle Markets ──────────────────────────────────────────────────────

  /** Get cattle markets, optionally filtered by state */
  async getCattleMarkets(state?: string): Promise<
    {
      id: string;
      name: string;
      lat: number;
      lng: number;
      state: string;
      district: string;
      operatingDay: string | null;
    }[]
  > {
    const qb = this.cattleMarketRepo.createQueryBuilder('c');
    if (state) qb.andWhere('LOWER(c.state) = LOWER(:state)', { state });
    qb.select([
      'c.id',
      'c.name',
      'c.latitude',
      'c.longitude',
      'c.state',
      'c.district',
      'c.operatingDay',
    ]);
    qb.orderBy('c.name', 'ASC');
    const rows = await qb.getMany();
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      lat: c.latitude,
      lng: c.longitude,
      state: c.state,
      district: c.district,
      operatingDay: c.operatingDay,
    }));
  }

  // ── Water Boundaries (GeoJSON) ──────────────────────────────────────────

  /**
   * Get water boundaries as GeoJSON FeatureCollection.
   * Optionally filter by bounding box for performance.
   */
  async getWaterBoundariesGeoJson(bbox?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  }): Promise<{
    type: string;
    features: any[];
  }> {
    let query: string;
    let params: any[];

    if (bbox) {
      // Use spatial query with bounding box filter for performance
      query = `
        SELECT "osmId", code, fclass, name,
               ST_AsGeoJSON(geometry)::json as geometry
        FROM bio_water_boundaries
        WHERE geometry && ST_MakeEnvelope($1, $2, $3, $4, 4326)
      `;
      params = [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat];
    } else {
      // Return a limited number of features to prevent hanging
      query = `
        SELECT "osmId", code, fclass, name,
               ST_AsGeoJSON(geometry)::json as geometry
        FROM bio_water_boundaries
        LIMIT 100
      `;
      params = [];
    }

    const rows = await this.waterBoundaryRepo.query(query, params);

    return {
      type: 'FeatureCollection',
      features: rows
        .filter((r: any) => r.geometry !== null)
        .map((r: any) => ({
          type: 'Feature',
          properties: {
            osm_id: r.osmId,
            code: r.code,
            fclass: r.fclass,
            name: r.name,
          },
          geometry: r.geometry,
        })),
    };
  }

  /**
   * Get simplified water boundaries for initial map load.
   * Returns simplified polygons safely preserving topology for faster rendering.
   */
  async getWaterBoundariesSimplified(
    bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number },
    zoom = 10,
  ): Promise<{
    type: string;
    features: any[];
  }> {
    let query: string;
    let params: any[] = [];

    if (bbox) {
      const width = bbox.maxLng - bbox.minLng;
      // Calculate a zoom-dependent floor for tolerance to prevent small/medium features collapsing to NULL
      const toleranceFloor =
        zoom >= 15
          ? 0.00001
          : zoom >= 13
            ? 0.00005
            : zoom >= 11
              ? 0.0001
              : 0.0005;
      const tolerance = Math.max(
        toleranceFloor,
        Math.min(0.03, width / (zoom >= 13 ? 1500 : 900)),
      );
      const limit =
        zoom >= 13 ? 3000 : zoom >= 11 ? 2500 : zoom >= 8 ? 2000 : 6000;
      query = `
        SELECT "osmId", code, fclass, name,
               ST_AsGeoJSON(ST_Simplify(geometry, $5), 5)::json as geometry
        FROM bio_water_boundaries
        WHERE geometry && ST_MakeEnvelope($1, $2, $3, $4, 4326)
        ORDER BY ST_Area(geometry) DESC
        LIMIT $6
      `;
      params = [
        bbox.minLng,
        bbox.minLat,
        bbox.maxLng,
        bbox.maxLat,
        tolerance,
        limit,
      ];
    } else {
      const tolerance = zoom < 8 ? 0.02 : 0.01;
      const limit = zoom < 8 ? 8000 : 4000;
      query = `
        SELECT "osmId", code, fclass, name,
               ST_AsGeoJSON(ST_Simplify(geometry, $1), 4)::json as geometry
        FROM bio_water_boundaries
        WHERE geometry IS NOT NULL
        ORDER BY ST_Area(geometry) DESC
        LIMIT $2
      `;
      params = [tolerance, limit];
    }

    const rows = await this.waterBoundaryRepo.query(query, params);

    return {
      type: 'FeatureCollection',
      features: rows
        .filter((r: any) => r.geometry !== null)
        .map((r: any) => ({
          type: 'Feature',
          properties: {
            osm_id: r.osmId,
            code: r.code,
            fclass: r.fclass,
            name: r.name,
          },
          geometry: r.geometry,
        })),
    };
  }

  // ── Sites & Diseases ────────────────────────────────────────────────────

  /**
   * Sites the caller can actually see, with their coordinates.
   *
   * This route used to be unauthenticated and unfiltered: it returned the name
   * and GPS position of every site in the database to anyone who asked. Both
   * halves are fixed - the controller now requires a JWT, and the query is
   * bound to the projects the caller reaches through user_roles.
   */
  async getSites(user: any): Promise<any[]> {
    const tenant = await this.tenantScopeService.forUser(user);

    // Not system scope and no reachable project means no sites, never all of
    // them. Interpolating an empty IN list would be a syntax error, so the
    // empty case returns early rather than building a query at all.
    if (!tenant.isSystem && !tenant.projectIds.length) return [];

    // `sites."projectId"` is a text column, not uuid - cast accordingly.
    const scopePredicate = tenant.isSystem
      ? ''
      : 'WHERE s."projectId" = ANY($1::text[])';
    const params = tenant.isSystem ? [] : [tenant.projectIds];

    const rows = await this.siteRepo.query(
      `
      SELECT s.id, s.name,
             ST_X(l.coordinates::geometry) as lng,
             ST_Y(l.coordinates::geometry) as lat,
             COALESCE(r2.name, r1.name) as state
      FROM sites s
      LEFT JOIN locations l ON s.location_id = l.id
      LEFT JOIN regions r1 ON l."regionId" = r1.id
      LEFT JOIN regions r2 ON r1."parentRegionId" = r2.id
      ${scopePredicate}
      ORDER BY s.name ASC
    `,
      params,
    );

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      lat: r.lat,
      lng: r.lng,
      state: r.state,
    }));
  }

  async getDiseases(): Promise<Disease[]> {
    return this.diseaseRepo.find({
      select: ['id', 'name', 'shortName', 'code'],
      order: { name: 'ASC' },
    });
  }

  // ── eBird API Proxy ──────────────────────────────────────────────────────

  /**
   * Fetch recent bird observations from eBird API using a secure server-side request.
   */
  async getEbirdObservations(
    lat: number,
    lng: number,
    dist?: number,
    back?: number,
  ): Promise<any[]> {
    const apiKey = process.env.EBIRD_API_KEY;
    if (!apiKey) {
      console.error('EBIRD_API_KEY is not set; skipping eBird observations');
      return [];
    }
    const distParam = dist ?? 15;
    const backParam = back ?? 30;
    try {
      const response = await axios.get(
        'https://api.ebird.org/v2/data/obs/geo/recent',
        {
          params: {
            lat,
            lng,
            dist: distParam,
            back: backParam,
          },
          headers: {
            'X-eBirdApiToken': apiKey,
          },
          timeout: 10000, // 10 seconds timeout
        },
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      if (error.response) {
        console.error(
          `eBird API error ${error.response.status}: ${error.response.data}`,
        );
      } else if (error.request) {
        console.error('No response received from eBird API:', error.message);
      } else {
        console.error('Error setting up eBird request:', error.message);
      }
      return [];
    }
  }

  // ── Weather API Proxy ───────────────────────────────────────────────────

  /**
   * Fetch current weather details from OpenWeatherMap API.
   */
  async getWeather(lat: number, lng: number): Promise<any> {
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
      console.error('OWM_API_KEY is not set; skipping weather lookup');
      return null;
    }
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat,
            lon: lng,
            appid: apiKey,
            units: 'metric',
          },
          timeout: 10000,
        },
      );
      const d = response.data;
      return {
        temp: Math.round(d.main?.temp ?? 0),
        feelsLike: Math.round(d.main?.feels_like ?? 0),
        humidity: d.main?.humidity ?? 0,
        pressure: d.main?.pressure ?? 0,
        windSpeed: d.wind?.speed ? d.wind.speed.toFixed(1) : '0.0',
        windDeg: d.wind?.deg ?? 0,
        description: d.weather?.[0]?.description ?? 'Unknown',
        icon: d.weather?.[0]?.icon ?? '01d',
        cityName: d.name ?? 'Unknown',
        visibility: d.visibility ? (d.visibility / 1000).toFixed(1) : null,
        rain: d.rain?.['1h'] || d.rain?.['3h'] || 0,
        dewPoint: Math.round(
          (d.main?.temp ?? 0) - (100 - (d.main?.humidity ?? 0)) / 5,
        ), // approx
      };
    } catch (error: any) {
      console.error('getWeather failed:', error.message);
      return null;
    }
  }

  /**
   * Fetch historical weather details from Open-Meteo API.
   */
  async getHistoricalWeather(lat: number, lng: number): Promise<any> {
    try {
      const end = new Date();
      end.setDate(end.getDate() - 1); // yesterday (archive lag)
      const start = new Date(end);
      start.setDate(start.getDate() - 29);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);

      const response = await axios.get(
        'https://archive-api.open-meteo.com/v1/archive',
        {
          params: {
            latitude: lat,
            longitude: lng,
            start_date: fmt(start),
            end_date: fmt(end),
            daily:
              'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean',
            timezone: 'auto',
          },
          timeout: 10000,
        },
      );
      const d = response.data;
      const rawMax: number[] = d.daily?.temperature_2m_max ?? [];
      const rawMin: number[] = d.daily?.temperature_2m_min ?? [];
      const rawPrecip: number[] = d.daily?.precipitation_sum ?? [];
      const rawHumid: number[] = d.daily?.relative_humidity_2m_mean ?? [];
      const time: string[] = d.daily?.time ?? [];

      const dailyData = time
        .map((t, i) => ({
          date: t,
          maxTemp: rawMax[i],
          minTemp: rawMin[i],
          precip: rawPrecip[i],
          humidity: rawHumid[i],
        }))
        .filter((day) => day.maxTemp != null);

      const maxTemps = rawMax.filter((v) => v != null);
      const minTemps = rawMin.filter((v) => v != null);
      const precip = rawPrecip.filter((v) => v != null);
      const humid = rawHumid.filter((v) => v != null);
      const avg = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

      return {
        maxTemp: maxTemps.length ? Math.round(Math.max(...maxTemps)) : null,
        minTemp: minTemps.length ? Math.round(Math.min(...minTemps)) : null,
        avgMaxTemp: maxTemps.length ? Math.round(avg(maxTemps)!) : null,
        avgMinTemp: minTemps.length ? Math.round(avg(minTemps)!) : null,
        totalPrecip: precip.length
          ? precip.reduce((a, b) => a + b, 0).toFixed(1)
          : null,
        avgHumidity: humid.length ? Math.round(avg(humid)!) : null,
        days: maxTemps.length,
        dailyData,
      };
    } catch (error: any) {
      console.error('getHistoricalWeather failed:', error.message);
      return null;
    }
  }
}
