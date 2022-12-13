import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import path from 'path';
import request from 'supertest';

import dataSource from '../ormconfig';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/authentication/users/user.entity';
import { CategoryEntity } from '../src/categories/category.entity';
import { CreateZipStatusEntity } from '../src/files/createZipStatus.entity';
import { FileEntity } from '../src/files/file.entity';
import { SpacesService } from '../src/files/spaces.service';
import { GenreEntity } from '../src/genres/genre.entity';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';
import { envConfig } from '../src/lib/configs/envs';
import { TrackDto } from '../src/tracks/dtos/track.dto';
import { TrackEntity } from '../src/tracks/track.entity';

import { removeFile } from './utils/tracks';
import { checkZipStatus } from './utils/zip';
import { clearTable, createCategories, createGenres, signupAdmin } from './utils';

global.__baseDir = path.resolve(__dirname, '..');

jest.setTimeout(120000);

describe('Zip management', () => {
    let app: INestApplication;
    let adminCookie;

    const listTracks: TrackDto[] = [];

    const pathToMP3File = path.resolve(__dirname, 'data', 'files', 'Kamera-ExtendedMix.mp3');

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setPipe(app);
        setCookieSession(app);
        await app.init();

        await clearTable(CategoryEntity);
        await clearTable(GenreEntity);
        await clearTable(TrackEntity);
        await clearTable(FileEntity);
        await clearTable(UserEntity);
        await clearTable(CreateZipStatusEntity);

        await createGenres();
        await createCategories();
        const { cookie } = await signupAdmin(app);
        adminCookie = cookie;

        const { body: genres } = await request(app.getHttpServer())
            .get('/genres/list')
            .set('Cookie', adminCookie)
            .expect(200);

        const { body: categories } = await request(app.getHttpServer())
            .get('/categories/list')
            .set('Cookie', adminCookie)
            .expect(200);

        for (let i = 0; i < 3; i++) {
            const { body: trackFile } = await request(app.getHttpServer())
                .post('/files/file-upload')
                .set('Cookie', adminCookie)
                .attach('file', pathToMP3File)
                .expect(201);

            const { body } = await request(app.getHttpServer())
                .post('/tracks/create')
                .set('Cookie', adminCookie)
                .send({
                    title: 'New Track Title',
                    visible: true,
                    duration: trackFile.duration,
                    file: trackFile,
                    category: categories.data[0],
                    genre: genres.data[0],
                    isTest: true,
                })
                .expect(201);
            listTracks.push(body);
        }
    });

    afterAll(async () => {
        await clearTable(TrackEntity);
        for (const track of listTracks) {
            await removeFile(app, adminCookie, track.file.id);
        }
        await clearTable(FileEntity);
        await clearTable(UserEntity);
        await clearTable(CreateZipStatusEntity);
        listTracks.length = 0;
        await dataSource.destroy();
    });

    describe('/files/create/zip', () => {
        it('should process zip', async () => {
            const { body: createdRecord } = await request(app.getHttpServer()).get('/files/create/zip').expect(200);

            expect(createdRecord).toEqual({
                countFiles: null,
                id: expect.anything(),
                isFinished: false,
                pathToFile: '',
            });

            const zipStatus = await checkZipStatus(app, createdRecord.id);

            const configService = new Map();
            configService.set('DO_BUCKET_NAME', process.env.DO_BUCKET_NAME);
            configService.set('DO_ACCESS_KEY', process.env.DO_ACCESS_KEY);
            configService.set('DO_SECRET_KEY', process.env.DO_SECRET_KEY);
            configService.set('ENVIRONMENT', process.env.ENVIRONMENT);
            const spacesService = new SpacesService(configService as any);
            const key = zipStatus.pathToFile.replace(`${envConfig.cdn}/${configService.get('ENVIRONMENT')}/`, '');
            const uploadedObject = await spacesService.getObject(key);
            expect(uploadedObject).toBeDefined();

            const { body: response } = await request(app.getHttpServer())
                .delete('/files/remove/zip')
                .send({ id: zipStatus.id, url: zipStatus.pathToFile })
                .expect(200);
            expect(response).toEqual({ success: true });

            try {
                await spacesService.getObject(key);
            } catch (error: any) {
                expect(error.name).toEqual('NoSuchKey');
                expect(error.statusCode).toEqual(404);
            }
        });
    });
});
