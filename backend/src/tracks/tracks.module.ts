import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from './file.entity';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { TelegramService } from '../telegram/telegram.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import * as AWS from 'aws-sdk';
import { FileController } from './file.controller';

const spaceEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
export const s3 = new AWS.S3({ endpoint: spaceEndpoint.href });

@Module({
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([TrackEntity, FileEntity, GenreEntity, CategoryEntity])],
    controllers: [TracksController, FileController],
    providers: [TracksService, TelegramService],
    exports: [TracksService],
})
export class TracksModule {}
