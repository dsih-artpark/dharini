import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Cattle Market entity — stores livestock market data from cattle-market.csv
 *
 * CSV columns:
 *   market_name, operating_day, latitude, longitude,
 *   lgd_district, district, lgd_state, state, remark
 *
 * `remark` is deliberately not stored: it holds free-text sourcing notes about
 * how each row was researched, not data any consumer reads.
 */
@Entity('bio_cattle_markets')
export class BioCattleMarket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** market_name */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Weekday(s) the market operates, e.g. "Monday" or "Tuesday, Saturday".
   *
   * The source file writes an unknown day as the literal strings "NA" or
   * "ambiguous" for 551 of 822 rows. Those are normalised to NULL on ingest so
   * callers can tell "we don't know" from a real trading day, rather than
   * having to know which magic strings mean absent.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  operatingDay: string | null;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  district: string;

  /**
   * LGD (Local Government Directory) codes as published by the source.
   *
   * Kept as plain columns rather than a foreign key: they line up with the
   * `regions` primary keys (`state_<lgdCode>`, `district_<lgdCode>`), so a join
   * is available when something needs it, but this stays a standalone
   * reference layer that seeds independently of tenant data.
   */
  @Column({ type: 'varchar', length: 10, nullable: true })
  lgdStateCode: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  lgdDistrictCode: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
