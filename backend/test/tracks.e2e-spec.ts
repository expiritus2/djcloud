import path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearTable, createCategories, createGenres, signupAdmin } from './utils';
import { getConnection } from 'typeorm';
import { CategoryEntity } from '../src/categories/category.entity';
import { UserEntity } from '../src/users/user.entity';
import { GenreEntity } from '../src/genres/genre.entity';
import { TrackEntity } from '../src/tracks/track.entity';
import { FileEntity } from '../src/files/file.entity';
import { TrackDto } from '../src/tracks/dtos/track.dto';
import { createTrack, removeFile, uploadFile } from './utils/tracks';

global.__baseDir = path.resolve(__dirname, '..');

jest.setTimeout(30000);

describe('Tracks management', () => {
    let app: INestApplication;
    let adminCookie;
    let track;
    let trackFile;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
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
    });

    afterEach(async () => {
        await clearTable(TrackEntity);
        if (track) {
            await removeFile(app, adminCookie, track.file.id);
            track = undefined;
        }

        if (trackFile) {
            await removeFile(app, adminCookie, trackFile.id);
            trackFile = undefined;
        }
        await clearTable(FileEntity);
    });

    afterAll(async () => {
        await clearTable(CategoryEntity);
        await clearTable(GenreEntity);
        await clearTable(TrackEntity);
        await clearTable(FileEntity);
        await clearTable(UserEntity);
        const conn = getConnection();
        await conn.close();
    });

    describe('/tracks/create', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).post('/tracks/create').expect(403);
        });

        it('should create new track', async () => {
            const { createdTrack, trackFile, categories, genres } = await createTrack(app, adminCookie);

            track = createdTrack;

            const { duration, ...fileInfo } = trackFile;

            expect(createdTrack).toEqual({
                id: expect.anything(),
                title: 'New Track Title',
                visible: true,
                duration,
                file: fileInfo,
                category: categories.data[0],
                genre: genres.data[0],
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            });
        });
    });

    describe('GET /tracks/:id', () => {
        it('should not throw forbidden error if user is not admin', async () => {
            const { createdTrack } = await createTrack(app, adminCookie);
            track = createdTrack;
            await request(app.getHttpServer()).get(`/tracks/${createdTrack.id}`).expect(200);
        });

        it('should get track by id', async () => {
            const { createdTrack } = await createTrack(app, adminCookie);
            const { body } = await request(app.getHttpServer())
                .get(`/tracks/${createdTrack.id}`)
                .set('Cookie', adminCookie)
                .expect(200);

            track = createdTrack;

            expect(body).toEqual({ ...createdTrack, countRatings: 0, rating: 0 });
        });
    });

    describe('PATCH /tracks/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).patch(`/tracks/1`).expect(403);
        });

        it('should update track primitives', async () => {
            const { createdTrack } = await createTrack(app, adminCookie);

            track = createdTrack;

            const { body } = await request(app.getHttpServer())
                .patch(`/tracks/${createdTrack.id}`)
                .send({
                    title: 'Updated title',
                    visible: false,
                    duration: 4000,
                })
                .set('Cookie', adminCookie)
                .expect(200);
            expect(body).toEqual({
                ...createdTrack,
                title: 'Updated title',
                visible: false,
                duration: 4000,
                updatedAt: expect.anything(),
                countRatings: 0,
                rating: 0,
            });
            expect(body.updatedAt > createdTrack.updatedAt).toBeTruthy();
        });

        it('should update track file', async () => {
            const { createdTrack } = await createTrack(app, adminCookie);
            const { body: uploadedTrackFile } = await uploadFile(app, adminCookie);

            trackFile = uploadedTrackFile;

            const { body } = await request(app.getHttpServer())
                .patch(`/tracks/${createdTrack.id}`)
                .send({
                    title: 'Updated title',
                    visible: false,
                    duration: 4000,
                    file: uploadedTrackFile,
                })
                .set('Cookie', adminCookie)
                .expect(200);
            expect(body).toEqual({
                ...createdTrack,
                title: 'Updated title',
                visible: false,
                duration: 4000,
                file: uploadedTrackFile,
                updatedAt: expect.anything(),
                countRatings: 0,
                rating: 0,
            });
            expect(body.updatedAt > createdTrack.updatedAt).toBeTruthy();
        });
    });

    describe('DELETE /tracks/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).delete('/tracks/1').expect(403);
        });

        it('should remove track', async () => {
            const { createdTrack } = await createTrack(app, adminCookie);
            const { body } = await request(app.getHttpServer())
                .delete(`/tracks/${createdTrack.id}`)
                .set('Cookie', adminCookie)
                .expect(200);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...expectedTrack } = createdTrack;
            expect(body).toEqual({ ...expectedTrack, countRatings: 0, rating: 0 });

            await request(app.getHttpServer()).get(`/tracks/${createdTrack.id}`).set('Cookie', adminCookie).expect(404);
        });
    });
});

describe('/tracks/list', () => {
    jest.setTimeout(120000);

    let app: INestApplication;
    let adminCookie;

    const listTracks: TrackDto[] = [];

    const pathToMP3File = path.resolve(__dirname, 'data', 'files', 'Kamera-ExtendedMix.mp3');

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
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
                data: dbTracks.map((dbTrack) => ({ ...dbTrack, countRatings: 0, isDidRating: false, rating: 0 })),
                count: 10,
            });
        }
    });
});
