import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sample } from './sample.entity';
import { Exclude } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

@Entity('species')
export class Species {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiPropertyOptional({
    description: 'Dynamic emoji for the species',
    example: '🐔',
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
    description: 'Abbreviation for the species used in accession ID',
    example: 'CH',
  })
  @Column({ nullable: true })
  abbreviation?: string | null;

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.species)
  samples: Sample[];

  @ApiProperty()
  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
