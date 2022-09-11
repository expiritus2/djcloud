import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrackEntity } from '../tracks/track.entity';

@Entity('listenStats')
export class ListenStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => TrackEntity, (track) => track.listenStats)
    @JoinColumn({ name: 'trackId' })
    track: TrackEntity;

    @Column()
    trackId: number;

    @Column()
    listenCount: number;
}
