import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { UsersService } from '../authentication/users/users.service';
import { TracksService } from '../tracks/tracks.service';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
    let controller: FilesController;
    let mockUsersService: UsersService;
    let mockFilesService;
    let mockTracksService;
    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const file = {
        name: 'fileName',
        url: 'http://example.com/test.mp3',
        size: 400078,
        mimetype: 'audio/mpeg',
        duration: 400.65,
    };

    beforeEach(async () => {
        mockFilesService = {
            storeFile: jest.fn(),
            removeFile: jest.fn(),
            getFileById: jest.fn(),
            createRecord: jest.fn(),
            removeZip: jest.fn(),
        };
        mockTracksService = {
            getAll: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            imports: [NestjsFormDataModule],
            controllers: [FilesController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: FilesService,
                    useValue: mockFilesService,
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

        controller = module.get<FilesController>(FilesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('fileUpload', () => {
        it('should upload file', async () => {
            mockFilesService.storeFile.mockResolvedValueOnce(file);

            const result = await controller.fileUpload({ file } as any);

            expect(mockFilesService.storeFile).toBeCalledWith(file);
            expect(result).toEqual(file);
        });
    });

    describe('fileRemove', () => {
        it('should remove file', async () => {
            mockFilesService.removeFile.mockResolvedValueOnce(file);

            const result = await controller.fileRemove({ id: 1 });

            expect(mockFilesService.removeFile).toBeCalledWith(1);
            expect(result).toEqual(file);
        });
    });

    describe('getFileById', () => {
        it('should return file by id', async () => {
            mockFilesService.getFileById.mockResolvedValueOnce({ id: 1, ...file });

            const result = await controller.getFileById(1);

            expect(result).toEqual({ id: 1, ...file });
        });
    });

    describe('getStoredFiles', () => {
        it('should return tracks according query without pagination', async () => {
            const query = { visible: true };
            const allTracks = [
                {
                    id: 1,
                    title: 'title',
                    visible: true,
                    sentToTelegram: false,
                    duration: 234525,
                    rating: 10,
                    countRatings: 10,
                    genre: { id: 1, name: 'Genre', value: 'genre', tracks: [] },
                    category: { id: 1, name: 'Category', value: 'category', tracks: [] },
                    listenStats: { id: 1, trackId: 1, listenCount: 10, track: { id: 1 } as any },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    trackRatings: [{ id: 1, rating: 10, track: { id: 1 } as any }],
                    file: { url: 'fileUrl1', name: 'fileName1' },
                },
                {
                    id: 2,
                    title: 'title',
                    visible: true,
                    sentToTelegram: false,
                    duration: 234525,
                    rating: 10,
                    countRatings: 10,
                    genre: { id: 1, name: 'Genre', value: 'genre', tracks: [] },
                    category: { id: 1, name: 'Category', value: 'category', tracks: [] },
                    listenStats: { id: 1, trackId: 1, listenCount: 10, track: { id: 1 } as any },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    trackRatings: [{ id: 1, rating: 10, track: { id: 1 } as any }],
                    file: { url: 'fileUrl2', name: 'fileName2' },
                },
            ] as any;
            mockTracksService.getAll.mockResolvedValueOnce({ data: allTracks });

            const result = await controller.getStoredFiles(query);
            const expectedResult = allTracks.map((track) => ({
                fileUrl: track.file.url,
                fileName: track.file.name,
                title: track.title,
            }));

            expect(mockTracksService.getAll).toBeCalledWith({ ...query, isDisablePagination: true });
            expect(result).toEqual(expectedResult);
        });
    });
});
