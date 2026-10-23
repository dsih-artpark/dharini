import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Polygon,
  MultiPolygon,
} from 'typeorm';

/**
 * Water Boundary entity — stores GeoJSON features from india_natural_water_only.geojson
 *
 * GeoJSON properties:
 *   osm_id, code, fclass, name
 * Geometry type: Polygon or MultiPolygon (SRID 4326)
 *
 * Uses PostGIS geometry column to store the actual polygon boundaries,
 * enabling spatial queries (ST_Contains, ST_Intersects, etc.)
 */
@Entity('bio_water_boundaries')
export class BioWaterBoundary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** OpenStreetMap feature ID */
  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  osmId: string;

  /** OSM feature code (e.g., 8220 for wetland) */
  @Column({ type: 'int', nullable: true })
  code: number;

  /** Feature class (e.g., 'wetland', 'water', 'reservoir') */
  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  fclass: string;

  /** Feature name (if available) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  /**
   * PostGIS geometry column storing the polygon boundary.
   * Supports both Polygon and MultiPolygon types.
   * SRID 4326 = WGS 84 (standard lat/lng coordinate system).
   */
  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Geometry',
    srid: 4326,
    nullable: true,
  })
  geometry: Polygon | MultiPolygon;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
