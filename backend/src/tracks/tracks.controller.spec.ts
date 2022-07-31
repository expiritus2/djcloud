import { Test, TestingModule } from '@nestjs/testing';
import { getCaption, TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { CanActivate } from '@nestjs/common';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { cloneDeep, merge } from 'lodash';
import { TelegramService } from '../telegram/telegram.service';
import { getTime, subDays, subHours } from 'date-fns';
import { FilesService } from '../files/files.service';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';
import { TrackEntity } from './track.entity';
import { envConfig } from '../lib/configs/envs';

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
            sendMessage: jest.fn(),
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

        it('should send audio to telegram and update sentToTelegram in database if env is not test or ci', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });
            jest.spyOn(mockConfigService, 'get').mockReturnValueOnce('dev');
            const caption = getCaption(track as TrackEntity);
            const link = `${envConfig.frontendDomain}/tracks/${track.category.id}/${track.genre.id}?search=${track.title}`;
            const tagLink = `<a href="${link}">${caption}</a>`;

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).toBeCalledWith(track.file.url, {
                caption: tagLink,
                parse_mode: 'HTML',
            });
            expect(mockTrackService.update).toBeCalledWith(1, { sentToTelegram: true });
        });

        it('should not send audio to telegram if env is test', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).not.toBeCalled();
            expect(mockTrackService.update).not.toBeCalled();
        });

        it('should not send audio to telegram if env is ci', async () => {
            mockTrackService.create.mockResolvedValueOnce({ id: 1, ...track });
            jest.spyOn(mockConfigService, 'get').mockReturnValueOnce('ci');

            await controller.createTrack(track);

            expect(mockTelegramService.sendAudio).not.toBeCalled();
            expect(mockTrackService.update).not.toBeCalled();
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
            const result = await controller.getById(1, {});
            expect(result).toEqual({ id: 1, ...track, isDidRating: false });
        });
    });

    describe('update', () => {
        it('', async () => {
            const id = 1;
            const newTrackData = { title: 'Updated track title', visible: true };
            const updatedTrack = merge(cloneDeep(track), newTrackData);
            mockTrackService.update
                .mockResolvedValueOnce({ id, ...updatedTrack, sentToTelegram: false })
                .mockResolvedValueOnce({ id, ...updatedTrack, sentToTelegram: true });
            const caption = getCaption(track as TrackEntity);
            const link = `${envConfig.frontendDomain}/tracks/${updatedTrack.category.id}/${updatedTrack.genre.id}?search=${updatedTrack.title}`;
            const tagLink = `<a href="${link}">${caption}</a>`;

            const result = await controller.update(id, newTrackData);

            expect(mockTelegramService.sendAudio).toBeCalledWith(track.file.url, {
                caption: tagLink,
                parse_mode: 'HTML',
            });
            expect(mockTrackService.update).toBeCalledWith(id, newTrackData);
            expect(mockTrackService.update).toBeCalledWith(id, { sentToTelegram: true });
            expect(result).toEqual({ id: 1, ...track, title: newTrackData.title, sentToTelegram: true });
        });

        it('should update track and not send to telegram and update sentToTelegram in database', async () => {
            const id = 1;
            const newTrackData = { title: 'Updated track title', visible: false };
            const updatedTrack = merge(cloneDeep(track), newTrackData);
            mockTrackService.update.mockResolvedValueOnce({ id, ...updatedTrack, sentToTelegram: false });

            const result = await controller.update(id, newTrackData);

            expect(mockTrackService.update).toBeCalledWith(id, newTrackData);
            expect(mockTelegramService.sendAudio).not.toBeCalled();
            expect(mockTrackService.update).not.toBeCalledWith(id, { sentToTelegram: true });
            expect(result).toEqual({
                id: 1,
                ...track,
                visible: false,
                title: newTrackData.title,
                sentToTelegram: false,
            });
        });

        it('should not send to telegram and update sentToTelegram in database if visible true but sentToTelegram true', async () => {
            const id = 1;
            const newTrackData = { title: 'Updated track title', visible: true };
            const updatedTrack = merge(cloneDeep(track), newTrackData);
            mockTrackService.update.mockResolvedValueOnce({ id, ...updatedTrack, sentToTelegram: true });

            const result = await controller.update(id, newTrackData);

            expect(mockTrackService.update).toBeCalledWith(id, newTrackData);
            expect(mockTelegramService.sendAudio).not.toBeCalled();
            expect(mockTrackService.update).not.toBeCalledWith(id, { sentToTelegram: true });
            expect(result).toEqual({ id: 1, ...track, title: newTrackData.title, sentToTelegram: true });
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

    describe('sendToTelegram', () => {
        it('should send audio to telegram', async () => {
            const caption = getCaption(track as TrackEntity);
            const link = `${envConfig.frontendDomain}/tracks/${track.category.id}/${track.genre.id}?search=${track.title}`;
            const tagLink = `<a href="${link}">${caption}</a>`;
            await controller.sendToTelegram(track as TrackEntity);

            expect(mockTelegramService.sendAudio).toBeCalledWith(track.file.url, {
                caption: tagLink,
                parse_mode: 'HTML',
            });
        });

        it('should send message to telegram with correct link if sendAudio is fails', async () => {
            const caption = getCaption(track as TrackEntity);
            mockTelegramService.sendAudio.mockRejectedValueOnce(new Error('Some error message'));

            await controller.sendToTelegram(track as TrackEntity);

            expect(mockTelegramService.sendMessage).toBeCalledWith(
                `<a href="http://localhost:3000/tracks/1/1?search=Track title">http://localhost:3000/tracks/1/1?search=Track title</a>\n${caption}`,
                {
                    parse_mode: 'HTML',
                },
            );
        });
    });
});
