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
            getTrackStats: jest.fn(),
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
            mockStatsService.getTrackStats.mockResolvedValueOnce({ totalDuration: 400.45 });
            const result = await controller.getStats(query as unknown as GetAllDto);

            expect(mockStatsService.getTrackStats).toBeCalledWith(query);
            expect(result).toEqual({ totalDuration: 400.45 });
        });
    });
});
