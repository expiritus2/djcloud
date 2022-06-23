import { Test, TestingModule } from '@nestjs/testing';
import { TrackRatingsController } from './trackRatings.controller';
import { TrackRatingsService } from './trackRatings.service';
import { AdminGuard } from '../lib/guards/adminGuard';
import { CanActivate } from '@nestjs/common';

describe('TrackRatingsController', () => {
    let controller: TrackRatingsController;
    let mockTrackRatingsService;
    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        mockTrackRatingsService = {
            add: jest.fn(({ trackId, rating }) => ({ id: 1, track: { id: trackId }, rating })),
            getByTrackId: jest.fn((trackId) => [{ id: 1, track: { id: trackId }, rating: 10 }]),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TrackRatingsController],
            providers: [
                {
                    provide: TrackRatingsService,
                    useValue: mockTrackRatingsService,
                },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue(mockAdminGuard)
            .compile();

        controller = module.get<TrackRatingsController>(TrackRatingsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('add', () => {
        it('create should create new entity', async () => {
            const result = await controller.add({ trackId: 1, rating: 10 });
            expect(result).toEqual({
                id: 1,
                track: { id: 1 },
                rating: 10,
            });
        });
    });

    describe('getByTrackId', () => {
        it('should return all ratings by trackId', async () => {
            const result = await controller.getByTrackId(1);
            expect(result).toEqual([{ id: 1, track: { id: 1 }, rating: 10 }]);
        });
    });
});
