import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackEntity } from '../tracks/track.entity';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { filterTracks } from '../tracks/queries/filter';
import { mocked } from 'jest-mock';

jest.mock('../tracks/queries/filter');

describe('StatsService', () => {
    let service: StatsService;
    let mockTrackRepo;
    let mockQueryBuilder;
    let durationResult;
    const query = { categoryId: 1, genreId: 1, visible: true, withStats: true };

    beforeEach(async () => {
        durationResult = [
            {
                genre_id: 1,
                genre_name: 'name',
                genre_value: 'value',
                category_value: 'category_value',
                category_id: 'category_id',
                totalDuration: 409.58,
            },
            {
                genre_id: 2,
                genre_name: 'name2',
                genre_value: 'value2',
                category_value: 'category_value2',
                category_id: 'category_id2',
                totalDuration: 409.58,
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
            getRawMany: jest.fn(() => durationResult),
        };
        mockTrackRepo = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatsService,
                {
                    provide: getRepositoryToken(TrackEntity),
                    useValue: mockTrackRepo,
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

            const result = await service.getTracksTotalDuration(query as unknown as GetAllDto);

            expect(mockTrackRepo.createQueryBuilder).toBeCalledWith('track');
            expect(mockQueryBuilder.select).toBeCalledWith('SUM(track.duration)', 'totalDuration');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.category', 'category');
            expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('track.genre', 'genre');
            expect(filterTracks).toBeCalledWith(mockQueryBuilder, query, { searchFieldName: 'title' });
            expect(mockQueryBuilder.groupBy).toBeCalledWith('category.id');
            expect(mockQueryBuilder.addGroupBy).toBeCalledWith('genre.id');
            expect(mockQueryBuilder.getRawMany).toBeCalled();
            expect(result).toEqual(durationResult.reduce((acc, item) => acc + item.totalDuration, 0));
        });
    });
});
