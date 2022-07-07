import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from './file.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { TelegramService } from '../telegram/telegram.service';

@Module({
    imports: [TypeOrmModule.forFeature([TrackEntity, FileEntity, GenreEntity, CategoryEntity])],
    controllers: [TracksController],
    providers: [TracksService, TelegramService],
    exports: [TracksService],
})
export class TracksModule {}
