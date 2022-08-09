import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dtos/create-track.dto';
import { simplePaginateQuery } from '../lib/queries/pagination';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { cloneDeep, groupBy, merge, shuffle } from 'lodash';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import { GetAllDto } from './dtos/get-all.dto';
import { filterTracks } from './queries/filter';
import { GetTracksGenresDto, TrackGenresResponse } from './dtos/get-tracks-genres.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class TracksService {
    constructor(
        @InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>,
        @InjectRepository(GenreEntity) private genreRepo: Repository<GenreEntity>,
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
        private fileService: FilesService,
    ) {}

    async create(track: CreateTrackDto): Promise<TrackEntity> {
        const genre = await this.genreRepo.findOne({ where: { id: track.genre.id } });
        const category = await this.categoryRepo.findOne({ where: { id: track.category.id } });
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

    getAllQuery(query: GetAllDto) {
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
                'track.sentToTelegram',
                '"title"',
                '"visible"',
                '"duration"',
                '"createdAt"',
                '"updatedAt"',
                '"rating"',
                '"countRatings"',
                '"sentToTelegram"',
                '"file"',
                '"genre"',
                '"category"',
            ])
            .leftJoinAndSelect('track.file', 'file')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre');

        return filterTracks<TrackEntity>(queryBuilder, query, {
            searchFieldName: 'title',
        });
    }

    async getAllShuffle(query: GetAllDto): Promise<{ data: TrackEntity[]; count: number }> {
        const filteredTracks = this.getAllQuery(query);
        const [data, count] = await filteredTracks.getManyAndCount();
        const shuffledData = shuffle(data).slice(0, +query.limit);

        return { data: shuffledData, count };
    }

    async getAll(query: GetAllDto): Promise<{ data: TrackEntity[]; count: number }> {
        const filteredTracks = this.getAllQuery(query);
        const paginateQueryBuilder = simplePaginateQuery<TrackEntity>(filteredTracks, query);
        const [data, count] = await paginateQueryBuilder.getManyAndCount();

        return { data, count };
    }

    async getTracksGenres(query: GetTracksGenresDto): Promise<TrackGenresResponse> {
        const visible = query.visible !== undefined ? query.visible : true;

        const queryBuilder = this.trackRepo
            .createQueryBuilder('track')
            .select('COUNT(track.id)', 'countTracks')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre')
            .where('track.visible = :visible', { visible })
            .groupBy('genre.id')
            .addGroupBy('category.id');

        const trackGenres = await queryBuilder.getRawMany();
        const groupedByCategory = groupBy(trackGenres, 'category_id');

        return Object.entries(groupedByCategory).reduce((acc, [key, rawTracks]) => {
            return {
                ...acc,
                [key]: rawTracks.map((v) => ({
                    id: v.genre_id,
                    name: v.genre_name,
                    value: v.genre_value,
                    countTracks: v.countTracks,
                })),
            };
        }, {});
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

            if (attrs.file && attrs.file.id !== track.file.id) {
                await this.fileService.removeFile(track.file.id);
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
}
