import { Test, TestingModule } from '@nestjs/testing';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { CanActivate } from '@nestjs/common';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { cloneDeep, merge } from 'lodash';
import { TelegramService } from '../telegram/telegram.service';
import { getTime, subDays, subHours } from 'date-fns';
import { FilesService } from '../files/files.service';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';

describe('TracksController', () => {
    let controller: TracksController;
    let mockTrackService;
    let mockTelegramService;
    let mockFilesService;
    let mockConfigService;

    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };
    let mockSession = {};

    const file = {
        id: 1,
        name: 'fileName',
        url: 'https://test.com',
        size: 456000,
        mimetype: 'audio/mpeg4',
    };
    const track = {
        title: 'Track title',
        visible: true,
        duration: 435.34,
        file,
        category: { id: 1, name: 'Category Name', value: 'category_name' },
        genre: { id: 1, name: 'Genre Name', value: 'genre_name' },
    };

    beforeEach(async () => {
        mockConfigService = getMockConfigService();
        mockSession = {};
        mockTelegramService = {
            sendAudio: jest.fn(),
        };

        mockFilesService = {
            removeFile: jest.fn(),
        };
        mockTrackService = {
            storeFile: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeFile: jest.fn(),
            getTracksGenres: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TracksController],
            providers: [
                {
                    provide: TracksService,
                    useValue: mockTrackService,
                },
                {
                    provide: TelegramService,
                    useValue: mockTelegramService,
                },
                {
                    provide: FilesService,
                    useValue: mockFilesService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue(mockAdminGuard)
            .compile();

        controller = module.get<TracksController>(TracksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createTrack', () => {
        it('should create and return track', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });

            const result = await controller.createTrack(track);
            expect(result).toEqual({ id: 1, ...track });
        });

        it('should send audio to telegram if env is not test or ci', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });
            jest.spyOn(mockConfigService, 'get').mockReturnValueOnce('development');

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).toBeCalledWith(track.file.url, {
                caption: `${track.category.name} - ${track.genre.name}`,
            });
        });

        it('should not send audio to telegram if env is test', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).not.toBeCalled();
        });

        it('should not send audio to telegram if env is ci', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });
            jest.spyOn(mockConfigService, 'get').mockReturnValueOnce('ci');

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).not.toBeCalled();
        });
    });

    describe('getAll', () => {
        it('should return all tracks', async () => {
            const query = {};
            const copySession = cloneDeep(mockSession) as any;
            copySession.ratings = {
                1: { ratingDate: subHours(Date.now(), 1) },
                2: { ratingDate: getTime(subDays(Date.now(), 1)) },
            };
            mockTrackService.getAll.mockResolvedValueOnce({
                data: [
                    { id: 1, ...track },
                    { id: 2, ...track },
                ],
                count: 2,
            });
            const result = await controller.getAll(query, copySession);
            expect(result).toEqual({
                data: [
                    { id: 1, isDidRating: true, ...track },
                    { id: 2, isDidRating: false, ...track },
                ],
                count: 2,
            });
        });
        it('should return all tracks with isDidRating false if session.ratings is undefined', async () => {
            const query = {};
            const copySession = cloneDeep(mockSession) as any;
            copySession.ratings = undefined;
            mockTrackService.getAll.mockResolvedValueOnce({
                data: [
                    { id: 1, ...track },
                    { id: 2, ...track },
                ],
                count: 2,
            });
            const result = await controller.getAll(query, copySession);
            expect(result).toEqual({
                data: [
                    { id: 1, isDidRating: false, ...track },
                    { id: 2, isDidRating: false, ...track },
                ],
                count: 2,
            });
        });
    });

    describe('getById', () => {
        it('should return track by id', async () => {
            mockTrackService.findOne.mockResolvedValueOnce({ id: 1, ...track });
            const result = await controller.getById(1);
            expect(result).toEqual({ id: 1, ...track });
        });
    });

    describe('update', () => {
        it('should update track', async () => {
            const id = 1;
            const newTrackData = { title: 'Updated track title' };
            const updatedTrack = merge(track, newTrackData);
            mockTrackService.update.mockResolvedValueOnce({ id, ...updatedTrack });

            const result = await controller.update(id, newTrackData);
            expect(result).toEqual({ id: 1, ...track, title: newTrackData.title });
        });
    });

    describe('remove', () => {
        it('should remove track', async () => {
            mockTrackService.remove.mockResolvedValueOnce(track);

            const result = await controller.remove(1);
            expect(result).toEqual(track);
            expect(mockFilesService.removeFile).toBeCalledWith(track.file.id);
        });
    });

    describe('getTracksGenres', () => {
        it('should return tracks genres', async () => {
            mockTrackService.getTracksGenres.mockResolvedValueOnce(track);
            const result = await controller.getTracksGenres({ visible: true });
            expect(mockTrackService.getTracksGenres).toBeCalledWith({ visible: true });
            expect(result).toEqual(track);
        });
    });
});
