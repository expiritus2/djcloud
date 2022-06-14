import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'jest-mock';
import { TracksService } from '../tracks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackEntity } from '../track.entity';
import { FileEntity } from '../file.entity';
import { simplePaginateQuery } from '../../../lib/queries/pagination';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GenreEntity } from '../../genres/genre.entity';
import { CategoryEntity } from '../../categories/category.entity';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAudioDurationInSeconds } = require('get-audio-duration');

jest.mock('get-audio-duration');
jest.mock('../../../lib/queries/pagination');

global.__basePath = path.resolve(__dirname, '..', '..', '..', '..');

describe('TracksService', () => {
    let service: TracksService;
    let mockQueryBuilder;
    let mockFileRepo;
    let mockTrackRepo;
    let mockGenresRepo;
    let mockCategoriesRepo;

    const file = {
        filename: 'fileName',
        size: 456000,
        mimetype: 'audio/mpeg4',
    };
    const track = {
        title: 'Track title',
        visible: true,
        duration: 435.34,
        file: { id: 1 },
        category: { id: 1, name: 'Mixs', value: 'mixs' },
        genre: { id: 1, name: 'Hip-Hop', value: 'hip_hop' },
    };

    beforeEach(async () => {
        mockQueryBuilder = {
            getMany: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: 1, ...track }),
        };
        mockFileRepo = {
            create: jest.fn(),
            save: jest.fn(),
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
            ],
        }).compile();

        service = module.get<TracksService>(TracksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('storeFile', () => {
        it('should store file', async () => {
            const pathToFile = `${global.__basePath}/upload/test/${file.filename}`;
            const createdFile = {
                name: file.filename,
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
                'track.likes',
                'track.duration',
                'track.createdAt',
                'track.updatedAt',
                '"title"',
                '"visible"',
                '"likes"',
                '"duration"',
                '"createdAt"',
                '"updatedAt"',
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
    });
});
