import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../categories/category.entity';
import { CreateZipStatusEntity } from '../files/createZipStatus.entity';
import { FileEntity } from '../files/file.entity';
import { FilesService } from '../files/files.service';
import { SpacesService } from '../files/spaces.service';
import { GenreEntity } from '../genres/genre.entity';
import { TrackEntity } from '../tracks/track.entity';
import { TracksService } from '../tracks/tracks.service';

import { TrackRatingEntity } from './trackRating.entity';
import { TrackRatingsController } from './trackRatings.controller';
import { TrackRatingsService } from './trackRatings.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TrackRatingEntity,
            TrackEntity,
            FileEntity,
            GenreEntity,
            CategoryEntity,
            CreateZipStatusEntity,
        ]),
    ],
    providers: [TrackRatingsService, TracksService, FilesService, SpacesService],
    controllers: [TrackRatingsController],
})
export class TrackRatingsModule {}
