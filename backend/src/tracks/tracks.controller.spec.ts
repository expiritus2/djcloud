import { Test, TestingModule } from '@nestjs/testing';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { CanActivate } from '@nestjs/common';
import { AdminGuard } from '../lib/guards/adminGuard';
import { merge } from 'lodash';
import { TelegramService } from '../telegram/telegram.service';

describe('TracksController', () => {
    let controller: TracksController;
    let mockTrackService;
    let mockTelegramService;

    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const mockSession = {};

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
        category: { id: 1 },
        genre: { id: 1 },
    };

    beforeEach(async () => {
        mockTelegramService = {
            sendAudio: jest.fn(),
        };
        mockTrackService = {
            storeFile: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeFile: jest.fn(),
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

    // describe('fileUpload', () => {
    //     it('should upload and return file data', async () => {
    //         mockTrackService.storeFile.mockResolvedValueOnce({ id: 1, ...file });
    //
    //         const result = await controller.fileUpload({ file } as unknown as TrackFileDto);
    //
    //         expect(result).toEqual({ id: 1, ...file });
    //     });
    // });

    describe('createTrack', () => {
        it('should create and return track', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });

            const result = await controller.createTrack(track);
            expect(result).toEqual({ id: 1, ...track });
        });
    });

    describe('getAll', () => {
        it('should return all tracks', async () => {
            const query = {};
            mockTrackService.getAll.mockResolvedValueOnce({
                data: [{ id: 1, ...track }],
                count: 1,
            });
            const result = await controller.getAll(query, mockSession);
            expect(result).toEqual({ data: [{ id: 1, isDidRating: false, ...track }], count: 1 });
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
            expect(mockTrackService.removeFile).toBeCalledWith(track.file.id);
        });
    });
});
