import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { CanActivate } from '@nestjs/common';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { StatsService } from './stats.service';
import { GetAllDto } from '../tracks/dtos/get-all.dto';

describe('StatsController', () => {
    let controller: StatsController;
    let mockStatsService;
    const query = { categoryId: 1, genreId: 1, visible: true, withStats: true };

    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        mockStatsService = {
            getTracksTotalDuration: jest.fn(),
            addCountListen: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StatsController],
            providers: [
                {
                    provide: StatsService,
                    useValue: mockStatsService,
                },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue(mockAdminGuard)
            .compile();

        controller = module.get<StatsController>(StatsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getStats', () => {
        it('should call getTrackStats service method', async () => {
            mockStatsService.getTracksTotalDuration.mockResolvedValueOnce(400.45);
            const result = await controller.getStats(query as unknown as GetAllDto);

            expect(mockStatsService.getTracksTotalDuration).toBeCalledWith(query);
            expect(result).toEqual({ totalDuration: 400.45 });
        });
    });

    describe('addCountListen', () => {
        it('should call addCountListen service method', async () => {
            mockStatsService.addCountListen.mockResolvedValueOnce({ id: 1, trackId: 1, listenCount: 10 });
            const result = await controller.addCountListen(1);

            expect(mockStatsService.addCountListen).toBeCalledWith(1);
            expect(result).toEqual({ id: 1, trackId: 1, listenCount: 10 });
        });
    });
});
