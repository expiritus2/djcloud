import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from '../tracks/track.entity';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    value: string;

    @OneToMany(() => TrackEntity, (track) => track.category)
    tracks: TrackEntity[];
}
