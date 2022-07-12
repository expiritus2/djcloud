import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'jest-mock';
import { TracksService } from './tracks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { FileEntity } from './file.entity';
import { simplePaginateQuery } from '../lib/queries/pagination';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GenreEntity } from '../genres/genre.entity';
import { CategoryEntity } from '../categories/category.entity';
import path from 'path';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAudioDurationInSeconds } = require('get-audio-duration');
import { s3 } from './tracks.module';
import logger from '../lib/common/logger';

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

    const file = {
        name: 'fileName',
        originalName: 'originalName',
        size: 456000,
        mimetype: 'audio/mpeg4',
    };
    const track = {
        title: 'Track title',
        visible: true,
        duration: 435.34,
        file: { id: 1, mimetype: 'audio/mpeg4', name: 'SomeFileName.mp3', size: 4096 },
        category: { id: 1, name: 'Mixs', value: 'mixs' },
        genre: { id: 1, name: 'Hip-Hop', value: 'hip_hop' },
    };

    beforeEach(async () => {
        jest.spyOn(s3, 'putObject').mockImplementation((params: any, callback?: any) => {
            return callback(null);
        });
        mockConfigService = getMockConfigService();
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
            getRawMany: jest.fn(() => [{ genre_id: 1, genre_name: 'name', genre_value: 'value', countTracks: 2 }]),
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
            ],
        }).compile();

        service = module.get<TracksService>(TracksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('storeFile', () => {
        it('should store file', async () => {
            const pathToFile = `${global.__basePath}/upload/test/mockUUID-${file.originalName}`;
            const createdFile = {
                name: `mockUUID-${file.originalName}`,
                url: pathToFile,
                size: file.size,
                mimetype: file.mimetype,
            };
            mockFileRepo.create.mockReturnValueOnce(createdFile);
            mockFileRepo.save.mockResolvedValueOnce(createdFile);
            mocked(getAudioDurationInSeconds).mockResolvedValueOnce(435.24);

            const result = await service.storeFile(file as unknown as Express.Multer.File);

            expect(getAudioDurationInSeconds).toBeCalledWith(pathToFile);
            expect(mockFileRepo.create).toBeCalledWith(createdFile);
            expect(mockFileRepo.save).toBeCalledWith(createdFile);
            expect(result).toEqual({ ...createdFile, duration: 435.24 });
        });

        it('should throw error if upload not success', async () => {
            jest.spyOn(s3, 'putObject').mockImplementationOnce((params: any, callback?: any) => {
                return callback(new Error('Some error message'));
            });

            try {
                await service.storeFile(file as unknown as Express.Multer.File);
            } catch (error: any) {
                expect(error.message).toEqual('DoSpacesService_ERROR: Some error message');
            }
        });

        it('should throw error if upload not success with default error message', async () => {
            jest.spyOn(s3, 'putObject').mockImplementationOnce((params: any, callback?: any) => {
                return callback(new Error());
            });

            try {
                await service.storeFile(file as unknown as Express.Multer.File);
            } catch (error: any) {
                expect(error.message).toEqual('DoSpacesService_ERROR: Something went wrong');
            }
        });
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
            expect(mockGenresRepo.findOne).toBeCalledWith(track.genre.id);
            expect(mockCategoriesRepo.findOne).toBeCalledWith(track.category.id);
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
                '"title"',
                '"visible"',
                '"duration"',
                '"createdAt"',
                '"updatedAt"',
                '"rating"',
                '"file"',
                '"genre"',
                '"category"',
            ]);
            expect(simplePaginateQuery).toBeCalledWith(mockQueryBuilder, query, {
                searchFieldName: 'title',
            });
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
            jest.spyOn(service, 'removeFile').mockResolvedValueOnce(null);

            const result = await service.update(1, updatedTrack);

            expect(mockTrackRepo.save).toBeCalledWith({
                id: 1,
                ...track,
                ...updatedTrack,
            });
            expect(service.removeFile).toBeCalledWith(track.file.id);
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
            jest.spyOn(service, 'removeFile').mockResolvedValueOnce(null);

            const result = await service.update(1, updatedTrack);

            expect(mockTrackRepo.save).toBeCalledWith({
                id: 1,
                ...track,
                ...updatedTrack,
                file: track.file,
            });
            expect(service.removeFile).not.toBeCalled();
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
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(genre.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: query.category });
            expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: query.visible });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual([{ countTracks: 2, id: 1, name: 'name', value: 'value' }]);
        });

        it('should return visible with default value', async () => {
            const query = { category: 'category' };
            const result = await service.getTracksGenres(query);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(genre.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: query.category });
            expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: true });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual([{ countTracks: 2, id: 1, name: 'name', value: 'value' }]);
        });

        it('should return visible with false value', async () => {
            const query = { category: 'category', visible: false };
            const result = await service.getTracksGenres(query);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('COUNT(genre.id)', 'countTracks');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: query.category });
            expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: false });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();

            expect(result).toEqual([{ countTracks: 2, id: 1, name: 'name', value: 'value' }]);
        });
    });

    describe('removeFile', () => {
        it('should remove file from s3', async () => {
            mockFileRepo.findOne.mockResolvedValueOnce(track.file);
            mockFileRepo.remove.mockResolvedValueOnce(track.file);

            jest.spyOn(s3, 'deleteObject').mockImplementationOnce((params: any, callback?: any) => {
                return callback(null);
            });

            await service.removeFile(1);

            expect(s3.deleteObject).toBeCalledWith(
                {
                    Bucket: 'DO_BUCKET_NAME',
                    Key: 'test/SomeFileName.mp3',
                },
                expect.any(Function),
            );
            expect(logger.log).toBeCalledWith(`File with 1 was deleted successfully`);
        });

        it('should throw and log error', async () => {
            mockFileRepo.findOne.mockResolvedValueOnce(track.file);
            mockFileRepo.remove.mockResolvedValueOnce(track.file);

            jest.spyOn(s3, 'deleteObject').mockImplementationOnce((params: any, callback?: any) => {
                return callback(new Error('Some error message'));
            });

            await service.removeFile(1);

            expect(s3.deleteObject).toBeCalledWith(
                {
                    Bucket: 'DO_BUCKET_NAME',
                    Key: 'test/SomeFileName.mp3',
                },
                expect.any(Function),
            );
            expect(logger.log).toBeCalledWith(`Can not delete file with id: 1`);
        });

        it('should throw error by findOne', async () => {
            mockFileRepo.findOne.mockRejectedValueOnce(new Error('Some error message'));

            try {
                await service.removeFile(1);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`Can not delete file with id: 1`);
            }
        });
    });
});
