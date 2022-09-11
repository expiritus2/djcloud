import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getTime, subDays, subHours } from 'date-fns';
import { cloneDeep } from 'lodash';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { TracksService } from '../tracks/tracks.service';

import { TrackRatingsController } from './trackRatings.controller';
import { TrackRatingsService } from './trackRatings.service';

describe('TrackRatingsController', () => {
    let controller: TrackRatingsController;
    let mockTrackRatingsService;
    let mockTracksService;
    let session;
    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        session = {};
        mockTrackRatingsService = {
            add: jest.fn(({ trackId, rating }) => ({ id: 1, track: { id: trackId }, rating })),
            getByTrackId: jest.fn((trackId) => [{ id: 1, track: { id: trackId }, rating: 10 }]),
        };

        mockTracksService = {
            update: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TrackRatingsController],
            providers: [
                {
                    provide: TrackRatingsService,
                    useValue: mockTrackRatingsService,
                },
                {
                    provide: TracksService,
                    useValue: mockTracksService,
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
        it('add should create new entity', async () => {
            const result = await controller.add({ trackId: 1, rating: 10 }, session);
            expect(result).toEqual({
                id: 1,
                isDidRating: true,
                track: { id: 1 },
                rating: 10,
            });
        });
    });

    describe('getByTrackId', () => {
        it('should return all ratings by trackId', async () => {
            const result = await controller.getByTrackId(1, session);
            expect(result).toEqual([{ id: 1, track: { id: 1 }, rating: 10, isDidRating: false }]);
        });

        it('should set idDidRating to true if last rating did less than one day', async () => {
            const copySession = cloneDeep(session);
            copySession.ratings = {
                1: { ratingDate: subHours(Date.now(), 1) },
            };
            const result = await controller.getByTrackId(1, copySession);
            expect(result).toEqual([{ id: 1, track: { id: 1 }, rating: 10, isDidRating: true }]);
        });

        it('should set idDidRating to false if last rating did more than one day', async () => {
            const copySession = cloneDeep(session);
            copySession.ratings = {
                1: { ratingDate: getTime(subDays(Date.now(), 1)) },
            };
            const result = await controller.getByTrackId(1, copySession);
            expect(result).toEqual([{ id: 1, track: { id: 1 }, rating: 10, isDidRating: true }]);
        });

        it('should set idDidRating to false if session is undefined', async () => {
            const result = await controller.getByTrackId(1, undefined);
            expect(result).toEqual([{ id: 1, track: { id: 1 }, rating: 10, isDidRating: false }]);
        });
    });
});
