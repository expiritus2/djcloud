import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileEntity } from './file.entity';
import { SpacesService } from './spaces.service';
import { NotFoundException } from '@nestjs/common';

describe('FilesService', () => {
    let service: FilesService;
    let mockConfigService;
    let mockSpacesService;
    let mockFilesRepo;

    const uploadFile = {
        originalName: 'fileOriginalName',
        name: 'fileName',
        encoding: 'fileEncoding',
        mimetype: 'audio/mpeg',
        buffer: Buffer.from('text', 'utf-8'),
        size: 4000,
    };

    const fileInfo = {
        name: 'fileName',
        url: 'http://example.com/test.mp3',
        size: 400078,
        mimetype: 'audio/mpeg',
        duration: 400.65,
    };

    beforeEach(async () => {
        mockConfigService = getMockConfigService();
        mockSpacesService = {
            putObject: jest.fn(),
            deleteObject: jest.fn(),
        };
        mockFilesRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            imports: [NestjsFormDataModule],
            providers: [
                FilesService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: SpacesService,
                    useValue: mockSpacesService,
                },
                {
                    provide: getRepositoryToken(FileEntity),
                    useValue: mockFilesRepo,
                },
            ],
        }).compile();

        service = module.get<FilesService>(FilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('storeFile', () => {
        it('should store file', async () => {
            const newFile = {
                name: fileInfo.name,
                url: fileInfo.url,
                size: uploadFile.size,
                mimetype: uploadFile.mimetype,
            };

            mockSpacesService.putObject.mockResolvedValueOnce(fileInfo);
            mockFilesRepo.create.mockReturnValue(newFile);
            mockFilesRepo.save.mockReturnValue(newFile);

            const result = await service.storeFile(uploadFile);

            expect(mockSpacesService.putObject).toBeCalledWith(uploadFile);
            expect(mockFilesRepo.create).toBeCalledWith(newFile);
            expect(mockFilesRepo.save).toBeCalledWith(newFile);
            expect(result).toEqual({ ...newFile, duration: fileInfo.duration });
        });
    });

    describe('removeFile', () => {
        it('should remove file', async () => {
            const file = {
                id: 1,
                name: 'fileName',
                url: 'http://example.com/test.mp3',
                size: 400078,
                mimetype: 'audio/mpeg',
            };
            mockFilesRepo.findOne.mockResolvedValueOnce(file);
            mockFilesRepo.remove.mockResolvedValueOnce(file);
            mockSpacesService.deleteObject.mockResolvedValueOnce(file);

            const result = await service.removeFile(1);

            expect(mockFilesRepo.findOne).toBeCalledWith(1);
            expect(mockFilesRepo.remove).toBeCalledWith(file);
            expect(mockSpacesService.deleteObject).toBeCalledWith(file);

            expect(result).toEqual(file);
        });
    });

    describe('getFileById', () => {
        it('should return file by id', async () => {
            mockFilesRepo.findOne.mockResolvedValueOnce({ id: 1, ...fileInfo });

            const result = await service.getFileById(1);

            expect(mockFilesRepo.findOne).toBeCalledWith(1);
            expect(result).toEqual({ id: 1, ...fileInfo });
        });

        it('should throw error if file not found', async () => {
            mockFilesRepo.findOne.mockResolvedValueOnce(null);

            try {
                await service.getFileById(1);
            } catch (error: any) {
                expect(error instanceof NotFoundException).toBeTruthy();
                expect(error.message).toEqual('File with id: 1 not found');
            }
        });
    });
});
