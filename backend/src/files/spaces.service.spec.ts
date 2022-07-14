import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { getMockConfigService } from '../lib/testData/utils';
import { ConfigService } from '@nestjs/config';
import { mocked } from 'jest-mock';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../lib/common/logger');
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('uuid'),
}));

jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => ({
        putObject: jest.fn().mockReturnThis(),
        deleteObject: jest.fn().mockReturnThis(),
        promise: jest.fn().mockReturnThis(),
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
            const result = await service.putObject(uploadFile);

            expect(service.s3.putObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: `test/uuid-${uploadFile.originalName}`,
                Body: uploadFile.buffer,
                ACL: 'public-read',
            });

            expect(result).toEqual({
                duration: 400.54,
                mimetype: 'audio/mpeg',
                name: 'uuid-fileOriginalName',
                size: 4000,
                url: 'https://djcloud.fra1.cdn.digitaloceanspaces.com/test/uuid-fileOriginalName',
            });
        });

        it('should throw error with default message', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.putObject).mockImplementationOnce(() => {
                throw new Error();
            });

            try {
                await service.putObject(uploadFile);
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
                await service.putObject(uploadFile);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`DoSpacesService_ERROR: Some error message`);
            }
        });
    });

    describe('deleteObject', () => {
        it('should delete object', async () => {
            await service.deleteObject(file as any);

            expect(service.s3.deleteObject).toBeCalledWith({
                Bucket: 'DO_BUCKET_NAME',
                Key: `test/${file.name}`,
            });

            expect(service.s3.deleteObject(file as any).promise).toBeCalled();
        });

        it('should throw error', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mocked(service.s3.deleteObject).mockImplementationOnce(() => {
                throw new Error('Some error message');
            });

            try {
                await service.deleteObject(file as any);
            } catch (error: any) {
                expect(error instanceof InternalServerErrorException).toBeTruthy();
                expect(error.message).toEqual(`Can not delete file with id: 1`);
            }
        });
    });
});
