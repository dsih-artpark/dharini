import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medias')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar' })
  path: string;
}
