import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  contactNumber?: string | null;

  @Column({ type: 'int', nullable: true })
  otp?: number | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpireTime: Date | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
