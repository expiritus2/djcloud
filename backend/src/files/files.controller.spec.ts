import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../lib/guards/adminGuard';
import { CanActivate } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesService } from './files.service';

describe('FilesController', () => {
    let controller: FilesController;
    let mockUsersService: UsersService;
    let mockFilesService;
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

            const result = await controller.fileRemove(1);

            expect(mockFilesService.removeFile).toBeCalledWith(1);
            expect(result).toEqual(file);
        });
    });
});
