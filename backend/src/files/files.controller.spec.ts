import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { UsersService } from '../authentication/users/users.service';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { TracksService } from '../tracks/tracks.service';

import { CreateZipStatusEntity } from './createZipStatus.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

const sleep = (timout: number) => new Promise((resolve) => setTimeout(resolve, timout));

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
            createZip: jest.fn(),
            setZeroFile: jest.fn(),
            removeZip: jest.fn(),
            checkZipStatus: jest.fn(),
            getStatusRecordById: jest.fn(),
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

    describe('createZip', () => {
        it('should create zip and return status record if tracks was found', async () => {
            const query = { categoryId: 1, genreId: 1 } as unknown as GetAllDto;
            const tracks = [{ id: 1 }];
            const statusRecord = { id: 1, isFinished: false };
            mockTracksService.getAll.mockResolvedValueOnce({ data: tracks });
            mockFilesService.createRecord.mockResolvedValueOnce(statusRecord);

            const result = await controller.createZip(query);

            expect(mockTracksService.getAll).toBeCalledWith({ ...query, isDisablePagination: true });
            expect(mockFilesService.createZip).toBeCalledWith(tracks, statusRecord);
            expect(result).toEqual(statusRecord);
        });

        it('should not create zip set 0 tracks and return status record if tracks was not found', async () => {
            const query = { categoryId: 1, genreId: 1 } as unknown as GetAllDto;
            const tracks = [];
            const statusRecord = { id: 1, isFinished: false };
            mockTracksService.getAll.mockResolvedValueOnce({ data: tracks });
            mockFilesService.createRecord.mockResolvedValueOnce(statusRecord);

            const result = await controller.createZip(query);

            expect(mockTracksService.getAll).toBeCalledWith({ ...query, isDisablePagination: true });
            expect(mockFilesService.setZeroFile).toBeCalledWith(statusRecord.id);
            expect(result).toEqual(statusRecord);
        });

        it('should remove zip if error', async () => {
            const query = { categoryId: 1, genreId: 1 } as unknown as GetAllDto;
            const tracks = [{ id: 1 }];
            const statusRecord = { id: 1, isFinished: false };

            mockTracksService.getAll.mockResolvedValueOnce({ data: tracks });
            mockFilesService.createRecord.mockResolvedValueOnce(statusRecord);
            mockFilesService.getStatusRecordById.mockResolvedValueOnce({ ...statusRecord, pathToFile: 'pathToFile' });
            mockFilesService.createZip.mockRejectedValueOnce(new Error('Some error message'));

            await controller.createZip(query);

            await sleep(10);

            expect(mockFilesService.removeZip).toBeCalledWith(1, 'pathToFile');
        });
    });

    describe('removeZip', () => {
        it('should call removeZip filesService method', async () => {
            const body = { id: 1, url: 'https://some-domain/tracks.zip' };
            mockFilesService.removeZip.mockResolvedValueOnce({ success: true });

            const result = await controller.removeZip(body);

            expect(mockFilesService.removeZip).toBeCalledWith(body.id, body.url);
            expect(result).toEqual({ success: true });
        });
    });

    describe('checkZipStatus', () => {
        it('should call removeZip filesService method', async () => {
            const id = 1;
            const response: CreateZipStatusEntity = {
                id,
                isFinished: false,
                pathToFile: 'pathToFile',
                countFiles: null,
                progress: 88,
            };
            mockFilesService.checkZipStatus.mockResolvedValueOnce(response);

            const result = await controller.checkZipStatus(id);

            expect(mockFilesService.checkZipStatus).toBeCalledWith({ id });
            expect(result).toEqual(response);
        });
    });
});
