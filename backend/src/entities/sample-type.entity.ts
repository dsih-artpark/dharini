import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Sample } from './sample.entity';
import { StatusType } from '../common/enums/status.enum';
import { SurveillanceType } from './surveillance-type.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('sample_types')
export class SampleType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ApiPropertyOptional({
    description: 'Dynamic emoji for the sample type',
    example: '🚰',
  })
  @Column({ nullable: true })
  emojiIcon?: string | null;

  @ApiPropertyOptional({
    description: 'List of applicable disease short names',
    example: ['AI', 'FMD'],
  })
  @Column({ type: 'text', array: true, nullable: true })
  diseaseShortNames?: string[] | null;

  @ApiPropertyOptional({
    description:
      'Abbreviation used in the accession ID. A plain value (CL) is combined ' +
      'with the species abbreviation as {species}/{sampleType}. A value ' +
      'containing a slash (NA/EN) supplies both segments itself and skips the ' +
      'species, which is how environmental sample types are configured.',
    example: 'CL',
  })
  @Column({ nullable: true })
  abbreviation?: string | null;

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.sampleType)
  samples: Sample[];

  // surveillanceType is intentionally NOT excluded so it appears in API responses.
  @ManyToOne(
    () => SurveillanceType,
    (surveillanceType) => surveillanceType.sampleTypes,
  )
  surveillanceType: SurveillanceType;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
