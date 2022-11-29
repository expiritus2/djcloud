import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { CategoryEntity } from '../categories/category.entity';
import { GenreEntity } from '../genres/genre.entity';
import { TrackEntity } from '../tracks/track.entity';

import { CreateZipStatusEntity } from './createZipStatus.entity';
import { FileEntity } from './file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { SpacesService } from './spaces.service';

@Module({
    imports: [
        NestjsFormDataModule,
        TypeOrmModule.forFeature([FileEntity, TrackEntity, GenreEntity, CategoryEntity, CreateZipStatusEntity]),
    ],
    controllers: [FilesController],
    providers: [FilesService, SpacesService],
    exports: [FilesService],
})
export class FilesModule {}
