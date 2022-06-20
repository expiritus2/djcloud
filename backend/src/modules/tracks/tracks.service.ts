import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { env, envConfig } from '../../configs/envs';
import { CreateTrackDto } from './dtos/create-track.dto';
import { PaginationQueryDto } from '../../lib/common/dtos';
import { simplePaginateQuery } from '../../lib/queries/pagination';
import { UpdateTrackDto } from './dtos/update-track.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAudioDurationInSeconds } = require('get-audio-duration');
import { merge } from 'lodash';
import path from 'path';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';

@Injectable()
export class TracksService {
    constructor(
        @InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>,
        @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
        @InjectRepository(GenreEntity) private genreRepo: Repository<GenreEntity>,
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
    ) {}

    async storeFile(file: Express.Multer.File) {
        const { filename, size, mimetype } = file;
        const pathToFile = `${envConfig.domain}/${filename}`;
        const duration = await getAudioDurationInSeconds(pathToFile);

        const newFile = this.fileRepo.create({
            name: filename,
            url: pathToFile,
            size,
            mimetype,
        });
        const createdFile = await this.fileRepo.save(newFile);
        return { ...createdFile, duration };
    }

    async create(track: CreateTrackDto) {
        const genre = await this.genreRepo.findOne(track.genre.id);
        const category = await this.categoryRepo.findOne(track.category.id);
        const newTrack = this.trackRepo.create({
            title: track.title,
            visible: track.visible,
            duration: track.duration,
            file: track.file,
            category,
            genre,
        });
        return this.trackRepo.save(newTrack);
    }

    async getAll(query: PaginationQueryDto): Promise<{ data: TrackEntity[]; count: number }> {
        const queryBuilder = this.trackRepo
            .createQueryBuilder('track')
            .select([
                'track.id',
                'track.title',
                'track.visible',
                'track.duration',
                'track.createdAt',
                'track.updatedAt',
                '"title"',
                '"visible"',
                '"duration"',
                '"createdAt"',
                '"updatedAt"',
                '"file"',
                '"genre"',
                '"category"',
            ])
            .leftJoinAndSelect('track.file', 'file')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre');

        const paginateQueryBuilder = simplePaginateQuery<TrackEntity>(queryBuilder, query, {
            searchFieldName: 'title',
        });

        const [data, count] = await paginateQueryBuilder.getManyAndCount();
        return { data, count };
    }

    async findOne(id: string | number): Promise<TrackEntity> {
        const track = await this.trackRepo
            .createQueryBuilder('track')
            .leftJoinAndSelect('track.file', 'file')
            .leftJoinAndSelect('track.genre', 'genre')
            .leftJoinAndSelect('track.category', 'category')
            .where(`track.id = ${id}`)
            .getOne();

        if (!track) {
            throw new NotFoundException(`Track with id: ${id} not found`);
        }

        return track;
    }

    async update(id: string | number, attrs: UpdateTrackDto): Promise<TrackEntity> {
        const track = await this.findOne(id);

        const updatedTrack = merge(track, attrs);

        try {
            return this.trackRepo.save(updatedTrack);
        } catch (error: any) {
            throw new InternalServerErrorException(error);
        }
    }

    async remove(id: string | number): Promise<TrackEntity> {
        try {
            const track = await this.findOne(id);

            return this.trackRepo.remove(track);
        } catch (error: any) {
            throw new InternalServerErrorException(`Can not delete track with id: ${id}`);
        }
    }

    async removeFile(id: number): Promise<FileEntity> {
        try {
            const file = await this.fileRepo.findOne(id);
            fs.unlinkSync(path.join(global.__baseDir, 'upload', env, file.name));
            return this.fileRepo.remove(file);
        } catch (error: any) {
            throw new InternalServerErrorException(`Can not delete file with id: ${id}`);
        }
    }
}
