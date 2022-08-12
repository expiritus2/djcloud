import { INestApplication } from '@nestjs/common';
import { TrackDto } from '../src/tracks/dtos/track.dto';
import path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setPipe } from '../src/lib/configs/app/pipes';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { clearTable, createCategories, createGenres, signupAdmin } from './utils';
import { CategoryEntity } from '../src/categories/category.entity';
import { GenreEntity } from '../src/genres/genre.entity';
import { TrackEntity } from '../src/tracks/track.entity';
import { FileEntity } from '../src/files/file.entity';
import { UserEntity } from '../src/authentication/users/user.entity';
import request from 'supertest';
import { removeFile } from './utils/tracks';

global.__baseDir = path.resolve(__dirname, '..');

jest.setTimeout(120000);

describe('/tracks/list', () => {
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

        for (let i = 0; i < 10; i++) {
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
    });

    it('should not throw forbidden error if user is not admin', async () => {
        await request(app.getHttpServer()).get('/tracks/list').expect(200);
    });

    it('getAll tracks with pagination', async () => {
        const limit = 3;
        for (let i = 0; i < Math.round(listTracks.length / limit); i++) {
            const { body: tracks } = await request(app.getHttpServer())
                .get(`/tracks/list?limit=${limit}&page=${i}&field=track_id&sort=DESC`)
                .set('Cookie', adminCookie)
                .expect(200);
            const skip = i * limit;
            const dbTracks = listTracks.sort((a, b) => b.id - a.id).slice(skip, skip + limit);
            expect(tracks).toEqual({
                data: dbTracks.map((dbTrack) => ({
                    ...dbTrack,
                    countRatings: 0,
                    isDidRating: false,
                    rating: 0,
                    listenStats: null,
                })),
                count: 10,
            });
        }
    });
});
