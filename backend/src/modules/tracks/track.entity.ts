import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { FileEntity } from './file.entity';

@Entity('tracks')
export class TrackEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: true })
    visible: boolean;

    @Column({ default: 0 })
    likes: number;

    @Column({ type: 'float' })
    duration: number;

    @ManyToOne(() => GenreEntity, (genre) => genre.tracks)
    @JoinColumn({ name: 'genreId' })
    genre: GenreEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.tracks)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @OneToOne(() => FileEntity, (file) => file.track)
    @JoinColumn({ name: 'fileId' })
    file: FileEntity;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updatedAt: Date;
}
