import { Module } from '@nestjs/common';
import { TrackRatingsController } from './trackRatings.controller';
import { TrackRatingsService } from './trackRatings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackRatingEntity } from './trackRating.entity';
import { TrackEntity } from '../tracks/track.entity';
import { TracksService } from '../tracks/tracks.service';
import { FileEntity } from '../files/file.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { FilesService } from '../files/files.service';
import { SpacesService } from '../files/spaces.service';

@Module({
    imports: [TypeOrmModule.forFeature([TrackRatingEntity, TrackEntity, FileEntity, GenreEntity, CategoryEntity])],
    providers: [TrackRatingsService, TracksService, FilesService, SpacesService],
    controllers: [TrackRatingsController],
})
export class TrackRatingsModule {}
