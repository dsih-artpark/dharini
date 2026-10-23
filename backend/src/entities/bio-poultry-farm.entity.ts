import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Poultry Farm entity — stores farm data from list-of-poultry-farms-in-india.csv
 *
 * CSV columns:
 *   name, address, phone, email, lat, lng, url, rating_count, star_count,
 *   country, state, city, zip, facebook_link, instagram_link, twitter_link,
 *   whatsapp_link, tiktok_link, linkedin_link, youtube_link,
 *   primary_category_name, category_name
 */
@Entity('bio_poultry_farms')
export class BioPoultryFarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'double precision', default: 0 })
  starCount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zip: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  facebookLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  instagramLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  twitterLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  whatsappLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tiktokLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  linkedinLink: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  youtubeLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primaryCategoryName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
