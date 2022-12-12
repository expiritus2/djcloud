import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import { mocked } from 'jest-mock';
import JSZip from 'jszip';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { envConfig } from '../lib/configs/envs';
import { getMockConfigService } from '../lib/testData/utils';
import { TrackEntity } from '../tracks/track.entity';

import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { CreateZipStatusEntity } from './createZipStatus.entity';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';
import { SpacesService } from './spaces.service';

jest.mock('jszip');
jest.mock('axios', () => ({
    get: jest.fn(),
}));

describe('FilesService', () => {
    let service: FilesService;
    let mockConfigService;
    let mockSpacesService;
    let mockFilesRepo;
    let mockTracksRepo;
    let mockZipStatusRepo;

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
            uploadTrack: jest.fn(),
            uploadZip: jest.fn(),
        };
        mockFilesRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
        };

        mockTracksRepo = {};
        mockZipStatusRepo = {
            update: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
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
                {
                    provide: getRepositoryToken(TrackEntity),
                    useValue: mockTracksRepo,
                },
                {
                    provide: getRepositoryToken(CreateZipStatusEntity),
                    useValue: mockZipStatusRepo,
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

            mockSpacesService.uploadTrack.mockResolvedValueOnce(fileInfo);
            mockFilesRepo.create.mockReturnValue(newFile);
            mockFilesRepo.save.mockReturnValue(newFile);

            const result = await service.storeFile(uploadFile);

            expect(mockSpacesService.uploadTrack).toBeCalledWith(uploadFile);
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

            expect(mockFilesRepo.findOne).toBeCalledWith({ where: { id: 1 } });
            expect(mockFilesRepo.remove).toBeCalledWith(file);
            expect(mockSpacesService.deleteObject).toBeCalledWith('http://example.com/test.mp3');

            expect(result).toEqual(file);
        });
    });

    describe('getFileById', () => {
        it('should return file by id', async () => {
            mockFilesRepo.findOne.mockResolvedValueOnce({ id: 1, ...fileInfo });

            const result = await service.getFileById(1);

            expect(mockFilesRepo.findOne).toBeCalledWith({ where: { id: 1 } });
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

    describe('fillZip', () => {
        it('should get files in concurrent mode and fill zip', async () => {
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

            const zip = new JSZip();
            const statusRecord: CreateZipStatusEntity = {
                id: 1,
                isFinished: false,
                pathToFile: 'pathToFile',
                progress: 0,
                countFiles: null,
            };

            mocked(axios.get)
                .mockResolvedValueOnce({ data: 'trackData1' })
                .mockResolvedValueOnce({ data: 'trackData2' });
            zip.file = jest.fn();

            const now = 1670534028725;
            jest.spyOn(Date, 'now')
                .mockReturnValueOnce(1670534028725)
                .mockReturnValueOnce(now + 999)
                .mockReturnValueOnce(now + 1001);

            await service.fillZip(allTracks, zip, statusRecord);

            expect(axios.get).toHaveBeenNthCalledWith(1, 'fileUrl1', { responseType: 'arraybuffer' });
            expect(axios.get).toHaveBeenNthCalledWith(2, 'fileUrl2', { responseType: 'arraybuffer' });
            expect(zip.file).toHaveBeenNthCalledWith(1, allTracks[0].file.name, 'trackData1');
            expect(zip.file).toHaveBeenNthCalledWith(2, allTracks[1].file.name, 'trackData2');
            expect(mockZipStatusRepo.update).toHaveBeenNthCalledWith(1, statusRecord.id, { progress: 100 });
            expect(mockZipStatusRepo.update).not.toHaveBeenNthCalledWith(2, statusRecord.id, { progress: 100 });
        });
    });

    describe('createRecord', () => {
        const record: CreateZipStatusEntity = {
            id: 1,
            isFinished: false,
            pathToFile: '',
            progress: 0,
            countFiles: null,
        };

        it('should create new record', async () => {
            mockZipStatusRepo.create.mockReturnValueOnce(record);
            mockZipStatusRepo.save.mockResolvedValueOnce(record);

            const result = await service.createRecord();

            expect(mockZipStatusRepo.create).toBeCalledWith({ isFinished: false, pathToFile: '' });
            expect(mockZipStatusRepo.save).toBeCalledWith(record);
            expect(result).toEqual(record);
        });
    });

    describe('uploadZipToStorage', () => {
        const record: CreateZipStatusEntity = {
            id: 1,
            isFinished: false,
            pathToFile: '',
            progress: 0,
            countFiles: null,
        };

        const uploadedFile = {
            id: 1,
            name: 'filename',
            url: 'fileUrl',
            size: 12345,
            mimetype: 'mimetype',
            duration: 3456.65,
        };

        it('should upload zip to the storage', async () => {
            const zip = new JSZip();
            const fileData = Buffer.from('fileData');
            zip.file('zipContentFile', fileData);

            const uploadedZip: Omit<UploadedFile, 'id' | 'size' | 'mimetype'> = uploadedFile;
            mockSpacesService.uploadZip.mockResolvedValueOnce(uploadedZip);

            const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

            const result = await service.uploadZipToStorage(zipContent, record);

            expect(mockSpacesService.uploadZip).toBeCalledWith(
                {
                    buffer: zipContent,
                    originalName: 'tracks',
                } as UploadFile,
                record,
            );

            expect(result).toEqual(uploadedFile);
        });
    });

    describe('updateRecord', () => {
        it('should update record', async () => {
            mockZipStatusRepo.update.mockResolvedValueOnce();

            await service.updateRecord(1, { url: 'fileUrl' });

            expect(mockZipStatusRepo.update).toBeCalledWith(1, {
                pathToFile: 'fileUrl',
                isFinished: true,
                progress: 100,
            });
        });
    });

    describe('setZeroFile', () => {
        it('should set zero to record if no files', async () => {
            await service.setZeroFile(1);

            expect(mockZipStatusRepo.update).toBeCalledWith(1, {
                countFiles: 0,
                isFinished: true,
                progress: 0,
                pathToFile: '',
            });
        });
    });

    describe('createZip', () => {
        const record: CreateZipStatusEntity = {
            id: 1,
            isFinished: false,
            pathToFile: '',
            progress: 0,
            countFiles: null,
        };

        const tracks = [
            {
                id: 1,
                title: 'Track title',
                visible: true,
                sentToTelegram: false,
                duration: 2325.23,
                rating: 10,
                countRatings: 5,
                genre: { id: 1, name: 'Genre', value: 'genre', tracks: [] },
                category: { id: 1, name: 'Category', value: 'category', tracks: [] },
                file: { id: 1, name: 'filename', url: 'fileUrl', mimetype: 'mimetype', size: 23423, track: {} },
            },
        ];

        it('should create and fill zip', async () => {
            const actualFillZip = service.fillZip;
            service.fillZip = jest.fn().mockResolvedValueOnce(null);
            mockSpacesService.uploadZip.mockResolvedValueOnce({ url: 'fileUrl' });
            mockZipStatusRepo.update.mockResolvedValueOnce({
                ...record,
                pathToFile: fileInfo.url,
                isFinished: true,
                progress: 100,
            });
            const trackData = Buffer.from('trackData');
            mocked(axios.get).mockResolvedValueOnce({ data: trackData });
            const zipContent = Buffer.from('zipContent');
            JSZip.prototype.generateAsync = jest.fn().mockResolvedValueOnce(zipContent);

            await service.createZip(tracks as TrackEntity[], record);

            expect(JSZip.prototype.generateAsync).toBeCalledWith({ type: 'nodebuffer' });

            service.fillZip = actualFillZip;
        });
    });

    describe('getStatusRecordById', () => {
        const record = {
            id: 1,
            isFinished: false,
            pathToFile: 'pathToFile',
            progress: 0,
            countFiles: null,
        };

        it('should return status record by id', async () => {
            mockZipStatusRepo.findOne.mockResolvedValueOnce(record);

            const result = await service.getStatusRecordById(1);

            expect(mockZipStatusRepo.findOne).toBeCalledWith({ where: { id: 1 } });
            expect(result).toEqual(record);
        });
    });

    describe('removeZip', () => {
        it('should remove zip from spaces and from table', async () => {
            const result = await service.removeZip(1, `${envConfig.cdn}/pathToFile`);

            expect(mockSpacesService.deleteObject).toBeCalledWith('pathToFile');
            expect(mockZipStatusRepo.delete).toBeCalledWith({ id: 1 });
            expect(result).toEqual({ success: true });
        });
    });

    describe('checkZipStatus', () => {
        const record = {
            id: 1,
            isFinished: false,
            pathToFile: 'pathToFile',
            progress: 0,
            countFiles: null,
        };

        it('should return zip status', async () => {
            mockZipStatusRepo.findOneBy.mockResolvedValueOnce(record);

            const result = await service.checkZipStatus({ id: 1 });

            expect(result).toEqual(record);
        });
    });
});
