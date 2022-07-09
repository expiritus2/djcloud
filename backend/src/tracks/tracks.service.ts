import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { envConfig } from '../lib/configs/envs';
import { CreateTrackDto } from './dtos/create-track.dto';
import { simplePaginateQuery } from '../lib/queries/pagination';
import { UpdateTrackDto } from './dtos/update-track.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAudioDurationInSeconds } = require('get-audio-duration');
import * as AWS from 'aws-sdk';
import { cloneDeep, merge } from 'lodash';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { GetAllDto } from './dtos/get-all.dto';
import { filterTracks } from './queries/filter';
import { GetTracksGenresDto } from './dtos/get-tracks-genres.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { UploadedFile } from './dtos/track-file.dto';
import { s3 } from './tracks.module';

@Injectable()
export class TracksService {
    constructor(
        @InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>,
        @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
        @InjectRepository(GenreEntity) private genreRepo: Repository<GenreEntity>,
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
        private configService: ConfigService,
    ) {}

    async storeFile(file: UploadedFile) {
        const filename = `${uuid()}-${file.originalName}`;
        return new Promise((resolve, reject) => {
            const config = {
                Bucket: this.configService.get('DO_BUCKET_NAME'),
                Key: `${this.configService.get('NODE_ENV')}/${filename}`,
                Body: file.buffer,
                ACL: 'public-read',
            };
            s3.config.credentials = new AWS.Credentials({
                accessKeyId: this.configService.get('DO_ACCESS_KEY'),
                secretAccessKey: this.configService.get('DO_SECRET_KEY'),
            });
            s3.putObject(config, async (error: AWS.AWSError) => {
                if (!error) {
                    const pathToFile = `${envConfig.cdn}/${this.configService.get('NODE_ENV')}/${filename}`;
                    const duration = await getAudioDurationInSeconds(pathToFile);
                    const newFile = this.fileRepo.create({
                        name: filename,
                        url: pathToFile,
                        size: file.size,
                        mimetype: file.mimetype,
                    });
                    const createdFile = await this.fileRepo.save(newFile);
                    resolve({ ...createdFile, duration });
                } else {
                    reject(new Error(`DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`));
                }
            });
        });
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

    async getAll(query: GetAllDto): Promise<{ data: TrackEntity[]; count: number }> {
        const queryBuilder = this.trackRepo
            .createQueryBuilder('track')
            .select([
                'track.id',
                'track.title',
                'track.visible',
                'track.duration',
                'track.createdAt',
                'track.updatedAt',
                'track.rating',
                'track.countRatings',
                '"title"',
                '"visible"',
                '"duration"',
                '"createdAt"',
                '"updatedAt"',
                '"rating"',
                '"file"',
                '"genre"',
                '"category"',
            ])
            .leftJoinAndSelect('track.file', 'file')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre');

        const filteredTracks = filterTracks(queryBuilder, query);
        const paginateQueryBuilder = simplePaginateQuery<TrackEntity>(filteredTracks, query, {
            searchFieldName: 'title',
        });

        const [data, count] = await paginateQueryBuilder.getManyAndCount();

        return { data, count };
    }

    async getTracksGenres(
        query: GetTracksGenresDto,
    ): Promise<{ id: number; name: string; value: string; countTracks: number }[]> {
        const visible = query.visible !== undefined ? query.visible : true;
        const trackGenres = await this.trackRepo
            .createQueryBuilder('track')
            .select('COUNT(genre.id)', 'countTracks')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre')
            .where('category.value = :category', { category: query.category })
            .andWhere('track.visible = :visible', { visible })
            .groupBy('genre.id')
            .addGroupBy('category.id')
            .getRawMany();
        return trackGenres.map((trackGenre) => ({
            id: trackGenre.genre_id,
            name: trackGenre.genre_name,
            value: trackGenre.genre_value,
            countTracks: trackGenre.countTracks,
        }));
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

        const updatedTrack = merge(cloneDeep(track), cloneDeep(attrs));

        try {
            const savedTrack = await this.trackRepo.save(updatedTrack);

            if (attrs.file && attrs.file?.id !== track.file.id) {
                await this.removeFile(track.file.id);
            }
            return savedTrack;
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
            s3.deleteObject(
                {
                    Bucket: this.configService.get('DO_BUCKET_NAME'),
                    Key: `${this.configService.get('NODE_ENV')}/${file.name}`,
                },
                (error: AWS.AWSError) => {
                    if (!error) {
                        console.log('success');
                    }
                },
            );
            return this.fileRepo.remove(file);
        } catch (error: any) {
            throw new InternalServerErrorException(`Can not delete file with id: ${id}`);
        }
    }
}
