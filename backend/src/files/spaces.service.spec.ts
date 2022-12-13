import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'jest-mock';

import { getMockConfigService } from '../lib/testData/utils';

import { CreateZipStatusEntity } from './createZipStatus.entity';
import { SpacesService } from './spaces.service';

jest.mock('../lib/common/logger');
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('uuid'),
}));

jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => ({
        putObject: jest.fn().mockReturnThis(),
        deleteObject: jest.fn().mockReturnThis(),
        promise: jest.fn().mockReturnThis(),
        getObject: jest.fn().mockReturnThis(),
        config: {},
    })),
    Credentials: jest.fn((params: any) => params),
    Endpoint: jest.fn(),
}));

jest.mock('get-audio-duration', () => ({
    getAudioDurationInSeconds: jest.fn(() => 400.54),
}));

describe('SpacesService', () => {
    let service: SpacesService;
    let mockConfigService;

    const statusRecord: CreateZipStatusEntity = {
        id: 1,
        isFinished: false,
        pathToFile: 'pathToFile',
        progress: 0,
        countFiles: null,
    };

    const uploadFile = {
        originalName: 'fileOriginalName',
        name: 'fileName',
        encoding: 'fileEncoding',
        mimetype: 'audio/mpeg',
        buffer: Buffer.from('text', 'utf-8'),
        size: 4000,
    };

    const file = {
        id: 1,
        name: 'fileName',
        url: 'http://example.com/test.mp3',
        size: 400078,
        mimetype: 'audio/mpeg',
    };

    beforeEach(async () => {
        mockConfigService = getMockConfigService();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SpacesService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<SpacesService>(SpacesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('putObject', () => {
        it('should upload file to s3', async () => {
            const result = await service.uploadTrack(uploadFile);

            expect(service.s3.putObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: `test/uuid/${uploadFile.originalName}`,
                Body: uploadFile.buffer,
                ACL: 'public-read',
            });

            expect(result).toEqual({
                duration: 400.54,
                mimetype: 'audio/mpeg',
                name: 'fileOriginalName',
                size: 4000,
                url: 'https://djcloud.fra1.cdn.digitaloceanspaces.com/test/uuid/fileOriginalName',
            });
        });

        it('should upload file to s3 with not standard mimetype property name', async () => {
            const notStandardUploadFile = {
                ...uploadFile,
                mimetype: undefined,
                busBoyMimeType: uploadFile.mimetype,
            };
            const result = await service.uploadTrack(notStandardUploadFile);

            expect(service.s3.putObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: `test/uuid/${notStandardUploadFile.originalName}`,
                Body: notStandardUploadFile.buffer,
                ACL: 'public-read',
            });

            expect(result).toEqual({
                duration: 400.54,
                mimetype: 'audio/mpeg',
                name: 'fileOriginalName',
                size: 4000,
                url: 'https://djcloud.fra1.cdn.digitaloceanspaces.com/test/uuid/fileOriginalName',
            });
        });

        it('should throw error with default message', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.putObject).mockImplementationOnce(() => {
                throw new Error();
            });

            try {
                await service.uploadTrack(uploadFile);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`DoSpacesService_ERROR: Something went wrong`);
            }
        });

        it('should throw error with custom message', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.putObject).mockImplementationOnce(() => {
                throw new Error('Some error message');
            });

            try {
                await service.uploadTrack(uploadFile);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`DoSpacesService_ERROR: Some error message`);
            }
        });
    });

    describe('deleteObject', () => {
        it('should delete object', async () => {
            const key = `test/${file.name}`;
            await service.deleteObject(key);
            const config = {
                Bucket: 'DO_BUCKET_NAME',
                Key: key,
            };

            expect(service.s3.deleteObject).toBeCalledWith(config);

            expect(service.s3.deleteObject(config).promise).toBeCalled();
        });

        it('should throw error', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.deleteObject).mockImplementationOnce(() => {
                throw new Error('Some error message');
            });

            try {
                await service.deleteObject(file.url);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`Can not delete file with key: http://example.com/test.mp3`);
            }
        });
    });

    describe('getObject', () => {
        it('should return object', async () => {
            const result = await service.getObject('file-key.mp3');

            expect(service.s3.getObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: 'test/file-key.mp3',
            });

            expect(result).toBeDefined();
        });

        it('should throw error if getObject is fails', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.getObject).mockImplementationOnce(() => {
                throw new Error('Some error message');
            });
            const key = 'file-key.mp3';
            try {
                await service.getObject(key);
            } catch (error: any) {
                expect(error instanceof NotFoundException).toBeTruthy();
                expect(error.message).toEqual(`Can not find file with key: ${key}`);
            }
        });
    });

    describe('getKey', () => {
        it('should return unique key by default', () => {
            const result = service.getKey('fileName');

            expect(result).toEqual('test/uuid/fileName');
        });

        it('should return not unique key', () => {
            const result = service.getKey('fileName', false);

            expect(result).toEqual('test/fileName');
        });
    });

    describe('uploadZip', () => {
        it('should upload zip file to s3', async () => {
            const result = await service.uploadZip(uploadFile, statusRecord);

            expect(service.s3.putObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: 'test/fileOriginalName-1.zip',
                Body: uploadFile.buffer,
                ACL: 'public-read',
            });
            expect(service.s3.putObject().promise).toBeCalled();
            expect(result).toEqual({
                name: 'fileOriginalName',
                url: 'https://djcloud.fra1.cdn.digitaloceanspaces.com/test/fileOriginalName-1.zip',
            });
        });
    });
});
