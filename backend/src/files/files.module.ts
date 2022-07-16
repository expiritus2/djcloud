import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { TrackEntity } from '../tracks/track.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { SpacesService } from './spaces.service';

@Module({
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([FileEntity, TrackEntity, GenreEntity, CategoryEntity])],
    controllers: [FilesController],
    providers: [FilesService, SpacesService],
    exports: [FilesService],
})
export class FilesModule {}
