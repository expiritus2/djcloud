import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from '../files/file.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { TelegramService } from '../telegram/telegram.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesService } from '../files/files.service';
import { SpacesService } from '../files/spaces.service';

@Module({
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([TrackEntity, FileEntity, GenreEntity, CategoryEntity])],
    controllers: [TracksController],
    providers: [TracksService, TelegramService, FilesService, SpacesService],
    exports: [TracksService],
})
export class TracksModule {}
