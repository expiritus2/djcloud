import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { CategoryEntity } from '../categories/category.entity';
import { CreateZipStatusEntity } from '../files/createZipStatus.entity';
import { FileEntity } from '../files/file.entity';
import { FilesService } from '../files/files.service';
import { SpacesService } from '../files/spaces.service';
import { GenreEntity } from '../genres/genre.entity';
import { ListenStatsEntity } from '../stats/listenStats.entity';
import { StatsService } from '../stats/stats.service';
import { TelegramService } from '../telegram/telegram.service';

import { TrackEntity } from './track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
    imports: [
        NestjsFormDataModule,
        TypeOrmModule.forFeature([
            TrackEntity,
            FileEntity,
            GenreEntity,
            CategoryEntity,
            ListenStatsEntity,
            CreateZipStatusEntity,
        ]),
    ],
    controllers: [TracksController],
    providers: [TracksService, TelegramService, FilesService, SpacesService, StatsService],
    exports: [TracksService],
})
export class TracksModule {}
