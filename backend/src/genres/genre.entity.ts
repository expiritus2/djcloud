import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from '../tracks/track.entity';

@Entity('genres')
export class GenreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    value: string;

    @OneToMany(() => TrackEntity, (track) => track.genre)
    tracks: TrackEntity[];
}
