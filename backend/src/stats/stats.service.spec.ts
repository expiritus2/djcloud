import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocked } from 'jest-mock';

import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { filterTracks } from '../tracks/queries/filter';
import { TrackEntity } from '../tracks/track.entity';

import { ListenStatsEntity } from './listenStats.entity';
import { StatsService } from './stats.service';

jest.mock('../tracks/queries/filter');

describe('StatsService', () => {
    let service: StatsService;
    let mockTrackRepo;
    let mockListenStatsRepo;
    let mockQueryBuilder;
    let queryResult;
    const query = { categoryId: 1, genreId: 1, visible: true, withStats: true };

    beforeEach(async () => {
        queryResult = [
            {
                genre_id: 1,
                genre_name: 'name',
                genre_value: 'value',
                category_value: 'category_value',
                category_id: 'category_id',
                totalDuration: 409.58,
                totalFilesSize: 150000,
            },
            {
                genre_id: 2,
                genre_name: 'name2',
                genre_value: 'value2',
                category_value: 'category_value2',
                category_id: 'category_id2',
                totalDuration: 409.58,
                totalFilesSize: 150000,
            },
        ];
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
            addSelect: jest.fn().mockReturnThis(),
            getRawMany: jest.fn(() => queryResult),
        };
        mockTrackRepo = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };
        mockListenStatsRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatsService,
                {
                    provide: getRepositoryToken(TrackEntity),
                    useValue: mockTrackRepo,
                },
                {
                    provide: getRepositoryToken(ListenStatsEntity),
                    useValue: mockListenStatsRepo,
                },
            ],
        }).compile();

        service = module.get<StatsService>(StatsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTrackStats', () => {
        it('should query from database and sum durations', async () => {
            mocked(filterTracks).mockReturnValueOnce(mockQueryBuilder);

            const result = await service.getTracksStats(query as unknown as GetAllDto);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('SUM(track.duration)', 'totalDuration');
            expect(mockQueryBuilder.addSelect).toBeCalledWith('SUM(file.size)', 'totalFilesSize');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(filterTracks).toBeCalledWith(mockQueryBuilder, query, { searchFieldName: 'title' });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('file.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();
            expect(result).toEqual({
                totalDuration: queryResult.reduce((acc, item) => acc + item.totalDuration, 0),
                totalFilesSize: queryResult.reduce((acc, item) => acc + item.totalFilesSize, 0),
            });
        });
    });

    describe('addCountListen', () => {
        it('should create listen stats', async () => {
            const stat = { id: 1, track: 1, listenCount: 1 };
            mockTrackRepo.findOne.mockResolvedValueOnce({ id: 1 });
            mockListenStatsRepo.create.mockReturnValueOnce(stat);
            mockListenStatsRepo.save.mockReturnValueOnce(stat);

            const result = await service.addCountListen(1);

            expect(mockTrackRepo.findOne).toBeCalledWith({ where: { id: 1 } });
            expect(mockListenStatsRepo.findOne).toBeCalledWith({ where: { trackId: 1 } });
            expect(mockListenStatsRepo.create).toBeCalledWith({ trackId: 1, listenCount: 1 });
            expect(mockListenStatsRepo.save).toBeCalledWith({ id: 1, track: 1, listenCount: 1 });
            expect(result).toEqual(stat);
        });

        it('should update listen stats', async () => {
            const stat = { id: 1, track: 1, listenCount: 1 };
            mockTrackRepo.findOne.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce({ id: 1 });
            mockListenStatsRepo.findOne.mockResolvedValueOnce(stat).mockResolvedValueOnce({ ...stat, listenCount: 2 });
            mockListenStatsRepo.save.mockReturnValueOnce(stat).mockReturnValueOnce({ ...stat, listenCount: 2 });

            const result = await service.addCountListen(1);

            expect(mockTrackRepo.findOne).toBeCalledWith({ where: { id: 1 } });
            expect(mockListenStatsRepo.findOne).toBeCalledWith({ where: { trackId: 1 } });
            expect(mockListenStatsRepo.save).toBeCalledWith({ id: 1, track: 1, listenCount: 2 });
            expect(result).toEqual(stat);

            await service.addCountListen(1);
            expect(mockListenStatsRepo.save).toBeCalledWith({ id: 1, track: 1, listenCount: 3 });
        });

        it('should return null if track not exists', async () => {
            mockTrackRepo.findOne.mockResolvedValueOnce(null);
            const result = await service.addCountListen(1);

            expect(result).toBeNull();
        });
    });
});
