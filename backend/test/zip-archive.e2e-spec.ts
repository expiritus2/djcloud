import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import path from 'path';
import request from 'supertest';

import dataSource from '../ormconfig';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/authentication/users/user.entity';
import { CategoryEntity } from '../src/categories/category.entity';
import { FileEntity } from '../src/files/file.entity';
import { GenreEntity } from '../src/genres/genre.entity';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';
import { TrackDto } from '../src/tracks/dtos/track.dto';
import { TrackEntity } from '../src/tracks/track.entity';

import { removeFile } from './utils/tracks';
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
        listTracks.length = 0;
        await dataSource.destroy();
    });

    describe('/files/stored/files', () => {
        it('should return stored files urls and names', async () => {
            const { body: storedFiles } = await request(app.getHttpServer()).get('/files/stored/files').expect(200);
            const sortFn = (a, b) => a.fileUrl.localeCompare(b.fileUrl);
            const expectedResult = listTracks
                .map((track) => ({ fileUrl: track.file.url, fileName: track.file.name, title: track.title }))
                .sort(sortFn);

            expect(storedFiles.sort(sortFn)).toEqual(expectedResult);
        });
    });
});
