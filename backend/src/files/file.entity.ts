import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrackEntity } from '../tracks/track.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @OneToOne(() => TrackEntity, (track) => track.file)
  track: TrackEntity;
}
