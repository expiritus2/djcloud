import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { FileEntity } from '../files/file.entity';
import { TrackRatingEntity } from '../trackRatings/trackRating.entity';
import { ListenStatsEntity } from '../stats/listenStats.entity';

@Entity('tracks')
export class TrackEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: true })
    visible: boolean;

    @Column({ default: false })
    sentToTelegram: boolean;

    @Column({ type: 'float' })
    duration: number;

    @Column({ type: 'float' })
    rating: number;

    @Column()
    countRatings: number;

    @ManyToOne(() => GenreEntity, (genre) => genre.tracks)
    @JoinColumn({ name: 'genreId' })
    genre: GenreEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.tracks)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @OneToOne(() => FileEntity, (file) => file.track)
    @JoinColumn({ name: 'fileId' })
    file: FileEntity;

    @OneToMany(() => TrackRatingEntity, (trackRatings) => trackRatings.track)
    trackRatings: TrackRatingEntity[];

    @OneToOne(() => ListenStatsEntity, (listenStats) => listenStats.track)
    listenStats: ListenStatsEntity;

    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', nullable: false })
    updatedAt: Date;
}
