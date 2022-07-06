import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from './file.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { storage, fileFilter } from './track.utils';

@Module({
    imports: [
        MulterModule.register({
            storage,
            dest: `./upload/${process.env.NODE_ENV}`,
            fileFilter,
        }),
        TypeOrmModule.forFeature([TrackEntity, FileEntity, GenreEntity, CategoryEntity]),
    ],
    controllers: [TracksController],
    providers: [TracksService],
    exports: [TracksService],
})
export class TracksModule {}
