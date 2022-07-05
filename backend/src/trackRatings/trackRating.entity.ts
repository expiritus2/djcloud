import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from '../tracks/track.entity';

@Entity('trackRatings')
export class TrackRatingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @ManyToOne(() => TrackEntity, (trackRatings) => trackRatings.trackRatings)
    @JoinColumn({ name: 'trackId' })
    track: TrackEntity;

    @Column()
    ipAddress: string;
}
