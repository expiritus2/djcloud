import path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearTable, signupAdmin } from './utils';
import { UserEntity } from '../src/users/user.entity';
import { FileEntity } from '../src/files/file.entity';
import { removeFile, uploadFile } from './utils/tracks';
import { SpacesService } from '../src/files/spaces.service';
import { envConfig } from '../src/lib/configs/envs';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';
import dataSource from '../ormconfig';

global.__baseDir = path.resolve(__dirname, '..');

jest.setTimeout(30000);

describe('Files management', () => {
    let app: INestApplication;
    let adminCookie;
    let uploadedFile;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setPipe(app);
        setCookieSession(app);
        await app.init();

        await clearTable(FileEntity);
        await clearTable(UserEntity);

        const { cookie } = await signupAdmin(app);
        adminCookie = cookie;
    });

    afterEach(async () => {
        if (uploadedFile?.id) {
            await removeFile(app, adminCookie, uploadedFile.id);
        }
        await clearTable(FileEntity);
        uploadedFile = undefined;
    });

    afterAll(async () => {
        await clearTable(UserEntity);
        await clearTable(FileEntity);
        await dataSource.destroy();
    });

    describe('/files/file-upload', () => {
        it('should throw forbidden error if user is not admin', async () => {
            const { body } = await request(app.getHttpServer()).post('/files/file-upload').expect(403);
            expect(body.error).toEqual('Forbidden');
            expect(body.message).toEqual('Forbidden resource');
            expect(body.statusCode).toEqual(403);
        });

        it('should upload file with .mp3 extension', async () => {
            const { body: file } = await uploadFile(app, adminCookie);

            uploadedFile = file;

            expect(file).toEqual({
                duration: file.duration,
                id: expect.anything(),
                mimetype: 'audio/mpeg',
                name: expect.anything(),
                size: file.size,
                url: expect.anything(),
            });
        });

        it('should throw error if file not in [.mp3] formats and .wav format', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'file_example_WAV_1MG.wav');

            const { body: file } = await request(app.getHttpServer())
                .post('/files/file-upload')
                .set('Cookie', adminCookie)
                .attach('file', pathToFile)
                .expect(400);

            uploadedFile = file;

            expect(file.error).toEqual('Bad Request');
            expect(file.message).toEqual(['File extension not allowed. Allowed types: .mp3']);
        });

        it('should throw error if file not in [.mp3] formats and file without extension', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'testFileWithoutExtension');

            const { body: file } = await request(app.getHttpServer())
                .post('/files/file-upload')
                .set('Cookie', adminCookie)
                .attach('file', pathToFile)
                .expect(400);

            uploadedFile = file;

            expect(file.error).toEqual('Bad Request');
            expect(file.message).toEqual(['File extension not allowed. Allowed types: .mp3']);
        });
    });

    describe('/files/:id', () => {
        it('should get file by id', async () => {
            const { body: file } = await uploadFile(app, adminCookie);
            uploadedFile = file;

            const { body: storedFile } = await request(app.getHttpServer()).get(`/files/${file.id}`).expect(200);

            expect(storedFile).toEqual({ ...file, duration: undefined });
        });

        it('should throw error if file not found', async () => {
            const { body } = await request(app.getHttpServer()).get(`/files/1`).expect(404);
            expect(body.error).toEqual('Not Found');
            expect(body.message).toEqual('File with id: 1 not found');
        });
    });

    describe('/files/file-remove', () => {
        it('should remove file info from database and s3', async () => {
            const { body: file } = await uploadFile(app, adminCookie);
            const key = file.url.replace(`${envConfig.cdn}/${process.env.NODE_ENV}/`, '');

            const configService = new Map();
            configService.set('DO_BUCKET_NAME', process.env.DO_BUCKET_NAME);
            configService.set('DO_ACCESS_KEY', process.env.DO_ACCESS_KEY);
            configService.set('DO_SECRET_KEY', process.env.DO_SECRET_KEY);
            configService.set('NODE_ENV', process.env.NODE_ENV);
            const spacesService = new SpacesService(configService as any);
            const uploadedObject = await spacesService.getObject(key);

            expect(uploadedObject).toBeDefined();

            const { body } = await removeFile(app, adminCookie, file.id);

            expect(body).toEqual({
                mimetype: file.mimetype,
                name: file.name,
                size: file.size,
                url: file.url,
            });

            const { body: storedFile } = await request(app.getHttpServer()).get(`/files/${file.id}`).expect(404);
            expect(storedFile.error).toEqual('Not Found');
            expect(storedFile.message).toEqual(`File with id: ${file.id} not found`);

            try {
                await spacesService.getObject('test');
            } catch (error: any) {
                expect(error.name).toEqual('NoSuchKey');
                expect(error.statusCode).toEqual(404);
            }
        });
    });
});
