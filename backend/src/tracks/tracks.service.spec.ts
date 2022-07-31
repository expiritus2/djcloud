import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'jest-mock';
import { TracksService } from './tracks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from '../files/file.entity';
import { simplePaginateQuery } from '../lib/queries/pagination';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import path from 'path';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';
import { SpacesService } from '../files/spaces.service';
import { FilesService } from '../files/files.service';

jest.mock('../lib/common/logger');
jest.mock('get-audio-duration');
jest.mock('../lib/queries/pagination');
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mockUUID'),
}));

global.__basePath = path.resolve(__dirname, '..', '..');

describe('TracksService', () => {
    let service: TracksService;
    let mockQueryBuilder;
    let mockFileRepo;
    let mockTrackRepo;
    let mockGenresRepo;
    let mockCategoriesRepo;
    let mockConfigService;
    let mockFilesService;
    let spacesService: SpacesService;

    const track = {
        title: 'Track title',
        visible: true,
        duration: 435.34,
        file: { id: 1, mimetype: 'audio/mpeg4', name: 'SomeFileName.mp3', size: 4096 },
        category: { id: 1, name: 'Mixs', value: 'mixs' },
        genre: { id: 1, name: 'Hip-Hop', value: 'hip_hop' },
    };

    beforeEach(async () => {
        mockConfigService = getMockConfigService();
        spacesService = new SpacesService(mockConfigService);
        jest.spyOn(spacesService.s3, 'putObject').mockImplementation((params: any, callback?: any) => {
            return callback(null);
        });
        mockQueryBuilder = {
            getMany: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: 1, ...track }),
            getRawMany: jest.fn(() => [
                {
                    genre_id: 1,
                    genre_name: 'name',
                    genre_value: 'value',
                    category_value: 'category_value',
                    category_id: 'category_id',
                    countTracks: 2,
                },
            ]),
        };
        mockFileRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
        };
        mockTrackRepo = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };
        mockGenresRepo = {
            findOne: jest.fn(),
        };
        mockCategoriesRepo = {
            findOne: jest.fn(),
        };

        mockFilesService = {
            removeFile: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TracksService,
                {
                    provide: getRepositoryToken(TrackEntity),
                    useValue: mockTrackRepo,
                },
                {
                    provide: getRepositoryToken(FileEntity),
                    useValue: mockFileRepo,
                },
                {
                    provide: getRepositoryToken(GenreEntity),
                    useValue: mockGenresRepo,
                },
                {
                    provide: getRepositoryToken(CategoryEntity),
                    useValue: mockCategoriesRepo,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: FilesService,
                    useValue: mockFilesService,
                },
            ],
        }).compile();

        service = module.get<TracksService>(TracksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create track', async () => {
            mockTrackRepo.create.mockReturnValueOnce(track);
            mockTrackRepo.save.mockReturnValueOnce({ id: 1, ...track });
            mockGenresRepo.findOne.mockResolvedValueOnce({
                id: 1,
                name: 'Hip-Hop',
                value: 'hip_hop',
            });
            mockCategoriesRepo.findOne.mockResolvedValueOnce({
                id: 1,
                name: 'Mixs',
                value: 'mixs',
            });

            const result = await service.create(track);

            expect(mockTrackRepo.create).toBeCalledWith(track);
            expect(mockGenresRepo.findOne).toBeCalledWith({ where: { id: track.genre.id } });
            expect(mockCategoriesRepo.findOne).toBeCalledWith({ where: { id: track.category.id } });
            expect(mockTrackRepo.save).toBeCalledWith(track);
            expect(result).toEqual({ id: 1, ...track });
        });
    });

    describe('getAll', () => {
        it('should get all tracks', async () => {
            const query = {};
            mocked(simplePaginateQuery).mockReturnValueOnce(mockQueryBuilder);
            mockQueryBuilder.getManyAndCount.mockReturnValueOnce([
                { id: 1, name: 'Genre Name', value: 'genre_name' },
                1,
            ]);
            const genres = await service.getAll({});

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith([
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
            ]);
            expect(simplePaginateQuery).toBeCalledWith(mockQueryBuilder, query);
            expect(mockQueryBuilder.getManyAndCount).toBeCalled();
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.file', 'file');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(genres).toEqual({
                data: { id: 1, name: 'Genre Name', value: 'genre_name' },
                count: 1,
            });
        });
    });

    describe('findOne', () => {
        it('should find one track', async () => {
            const result = await service.findOne(1);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.file', 'file');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('track.id = 1');
            expect(mockQueryBuilder.getOne).toBeCalled();
            expect(result).toEqual({ id: 1, ...track });
        });

        it('should throw not found error if track not found', async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null);

            try {
                await service.findOne(1);
            } catch (error: any) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Track with id: 1 not found');
            }
        });
    });

    describe('update', () => {
        it('should update track', async () => {
            const updatedTrack = {
                title: 'Updated title',
                visible: false,
                category: { id: 2, name: 'Mixs', value: 'mixs' },
                genre: { id: 2, name: 'Hip-Hop', value: 'hip_hop' },
            };
            mockTrackRepo.save.mockResolvedValueOnce({ ...track, ...updatedTrack });

            const result = await service.update(1, updatedTrack);

            expect(mockTrackRepo.save).toBeCalledWith({
                id: 1,
                ...track,
                ...updatedTrack,
            });
            expect(result).toEqual({ ...track, ...updatedTrack });
        });

        it('should update track and remove old file', async () => {
            const updatedTrack = {
                title: 'Updated title',
                visible: false,
                category: { id: 2, name: 'Mixs', value: 'mixs' },
                genre: { id: 2, name: 'Hip-Hop', value: 'hip_hop' },
                file: { id: 2, mimetype: 'audio/mpeg4', name: 'SomeFileName.mpe', size: 4096, url: '' },
            };
            mockTrackRepo.save.mockResolvedValueOnce({ ...track, ...updatedTrack });
            mockFilesService.removeFile.mockResolvedValueOnce(null);

            const result = await service.update(1, updatedTrack);

            expect(mockTrackRepo.save).toBeCalledWith({
                id: 1,
                ...track,
                ...updatedTrack,
            });
            expect(mockFilesService.removeFile).toBeCalledWith(track.file.id);
            expect(result).toEqual({ ...track, ...updatedTrack });
        });

        it('should update track and not remove old file if new file is undefined', async () => {
            const updatedTrack = {
                title: 'Updated title',
                visible: false,
                category: { id: 2, name: 'Mixs', value: 'mixs' },
                genre: { id: 2, name: 'Hip-Hop', value: 'hip_hop' },
                file: undefined,
            };
            mockTrackRepo.save.mockResolvedValueOnce({ ...track, ...updatedTrack, file: track.file });
            mockFilesService.removeFile.mockResolvedValueOnce(null);

            const result = await service.update(1, updatedTrack);

            expect(mockTrackRepo.save).toBeCalledWith({
                id: 1,
                ...track,
                ...updatedTrack,
                file: track.file,
            });
            expect(mockFilesService.removeFile).not.toBeCalled();
            expect(result).toEqual({ ...track, ...updatedTrack, file: track.file });
        });

        it('should return error details', async () => {
            mockTrackRepo.save.mockImplementationOnce(() => {
                throw new Error('Some error message') as any;
            });

            try {
                await service.update(1, {});
            } catch (error: any) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toEqual('Some error message');
            }
        });
    });

    describe('remove', () => {
        it('should remove track', async () => {
            mockTrackRepo.findOne.mockResolvedValueOnce({ id: 1, ...track });
            mockTrackRepo.remove.mockResolvedValueOnce(track);
            mockFilesService.removeFile.mockResolvedValueOnce(null);

            const result = await service.remove(1);
            expect(mockTrackRepo.remove).toBeCalledWith({ id: 1, ...track });
            expect(result).toEqual(track);
        });

        it('should throw error if can not delete file', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error('Some error message'));
            try {
                await service.remove(1);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual('Can not delete track with id: 1');
            }
        });
    });

    describe('getTracksGenres', () => {
        it('should return track genres', async () => {
            const query = { category: 'category', visible: true };
            const result = await service.getTracksGenres(query);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(track.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('track.visible = :visible', { visible: query.visible });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual({ category_id: [{ countTracks: 2, id: 1, name: 'name', value: 'value' }] });
        });

        it('should return visible with default value', async () => {
            const query = {};
            const result = await service.getTracksGenres(query);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(track.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('track.visible = :visible', { visible: true });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual({ category_id: [{ countTracks: 2, id: 1, name: 'name', value: 'value' }] });
        });

        it('should return visible with false value', async () => {
            const query = { category: 'category', visible: false };
            const result = await service.getTracksGenres(query);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(track.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('track.visible = :visible', { visible: false });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual({ category_id: [{ countTracks: 2, id: 1, name: 'name', value: 'value' }] });
        });
    });
});
