import path from 'path';
import fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearTable, clearTestUploads, createCategories, createGenres, signupAdmin } from './utils';
import { getConnection } from 'typeorm';
import { CategoryEntity } from '../src/modules/categories/category.entity';
import { UserEntity } from '../src/modules/users/user.entity';
import { GenreEntity } from '../src/modules/genres/genre.entity';
import { TrackEntity } from '../src/modules/tracks/track.entity';
import { FileEntity } from '../src/modules/tracks/file.entity';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { TrackDto } from '../src/modules/tracks/dtos/track.dto';
import { createTrack, fileUpload } from './utils/tracks';

global.__baseDir = path.resolve(__dirname, '..');

describe('Tracks management', () => {
    let app: INestApplication;
    let adminCookie;

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
    });

    beforeEach(async () => {
        const { cookie } = await signupAdmin(app);
        adminCookie = cookie;
    });

    afterEach(async () => {
        await clearTable(TrackEntity);
        await clearTable(FileEntity);
        await clearTable(UserEntity);
        await clearTestUploads();
    });

    afterAll(async () => {
        await clearTable(CategoryEntity);
        await clearTable(GenreEntity);
        const conn = getConnection();
        await conn.close();
    });

    describe('/tracks/file-upload', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).post('/tracks/file-upload').expect(403);
        });

        it('should upload file with .mp3 extension', async () => {
            const { body } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToMP3File).expect(201);

            const duration = await getAudioDurationInSeconds(pathToMP3File);
            const stats = fs.statSync(pathToMP3File);

            expect(body).toEqual({
                duration,
                id: expect.anything(),
                mimetype: 'audio/mpeg',
                name: expect.anything(),
                size: stats.size,
                url: expect.anything(),
            });
        });

        it('should upload file with .wav extension', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'file_example_WAV_1MG.wav');

            const { body } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToFile).expect(201);

            const duration = await getAudioDurationInSeconds(pathToFile);
            const stats = fs.statSync(pathToFile);

            expect(body).toEqual({
                duration,
                id: expect.anything(),
                mimetype: 'audio/wave',
                name: expect.anything(),
                size: stats.size,
                url: expect.anything(),
            });
        });

        it('should throw error if file not in [.mp3, .wav] formats and .txt format', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'testFile.txt');

            const { body } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToFile).expect(403);
            expect(body.error).toEqual('Forbidden');
            expect(body.message).toEqual('File extension not allowed. Allowed types: .mp3,.wav');
        });

        it('should throw error if file not in [.mp3, .wav] formats and file without extension', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'testFileWithoutExtension');

            const { body } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToFile).expect(403);
            expect(body.error).toEqual('Forbidden');
            expect(body.message).toEqual('File extension not allowed. Allowed types: .mp3,.wav');
        });
    });

    describe('/tracks/create', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).post('/tracks/create').expect(403);
        });

        it('should create new track', async () => {
            const pathToFile = path.resolve(__dirname, 'data', 'files', 'Kamera-ExtendedMix.mp3');

            const { body: trackFile } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToFile).expect(201);

            const { body: genres } = await request(app.getHttpServer()).get('/genres/list').set('Cookie', adminCookie).expect(200);

            const { body: categories } = await request(app.getHttpServer()).get('/categories/list').set('Cookie', adminCookie).expect(200);

            const { body } = await request(app.getHttpServer())
                .post('/tracks/create')
                .set('Cookie', adminCookie)
                .send({
                    title: 'New Track Title',
                    visible: true,
                    duration: trackFile.duration,
                    file: trackFile,
                    category: { id: categories.data[0].id },
                    genre: { id: genres.data[0].id },
                })
                .expect(201);

            const { duration, ...fileInfo } = trackFile;

            expect(body).toEqual({
                id: expect.anything(),
                likes: 0,
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

    describe('/tracks/list', () => {
        const listTracks: TrackDto[] = [];

        afterAll(async () => {
            await clearTable(TrackEntity);
            await clearTable(FileEntity);
            await clearTable(UserEntity);
            await clearTestUploads();
        });

        beforeEach(async () => {
            const { body: genres } = await request(app.getHttpServer()).get('/genres/list').set('Cookie', adminCookie).expect(200);

            const { body: categories } = await request(app.getHttpServer()).get('/genres/list').set('Cookie', adminCookie).expect(200);

            for (let i = 0; i < 10; i++) {
                const { body: trackFile } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToMP3File).expect(201);

                const { body } = await request(app.getHttpServer())
                    .post('/tracks/create')
                    .set('Cookie', adminCookie)
                    .send({
                        title: 'New Track Title',
                        visible: true,
                        duration: trackFile.duration,
                        file: trackFile,
                        category: { id: categories.data[0].id },
                        genre: { id: genres.data[0].id },
                    })
                    .expect(201);
                listTracks.push(body);
            }
        });

        afterEach(async () => {
            await clearTable(TrackEntity);
            await clearTable(FileEntity);
            await clearTable(UserEntity);
            await clearTestUploads();
            listTracks.length = 0;
        });

        it('should not throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).get('/tracks/list').expect(200);
        });

        it('getAll tracks with pagination', async () => {
            const limit = 3;
            for (let i = 0; i < Math.round(listTracks.length / limit); i++) {
                const { body: tracks } = await request(app.getHttpServer()).get(`/tracks/list?limit=${limit}&page=${i}&field=track_id&sort=DESC`).set('Cookie', adminCookie).expect(200);
                const skip = i * limit;
                const dbTracks = listTracks.sort((a, b) => b.id - a.id).slice(skip, skip + limit);
                expect(tracks).toEqual({ data: dbTracks, count: 10 });
            }
        });
    });

    describe('GET /tracks/:id', () => {
        it('should not throw forbidden error if user is not admin', async () => {
            const track = await createTrack(app, adminCookie);
            await request(app.getHttpServer()).get(`/tracks/${track.id}`).expect(200);
        });

        it('should get category by id', async () => {
            const track = await createTrack(app, adminCookie);
            const { body } = await request(app.getHttpServer()).get(`/tracks/${track.id}`).set('Cookie', adminCookie).expect(200);

            expect(body).toEqual(track);
        });
    });

    describe('PATCH /tracks/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            const track = await createTrack(app, adminCookie);
            await request(app.getHttpServer()).patch(`/tracks/${track.id}`).expect(403);
        });

        it('should update track primiteives', async () => {
            const track = await createTrack(app, adminCookie);

            const { body } = await request(app.getHttpServer())
                .patch(`/tracks/${track.id}`)
                .send({
                    title: 'Updated title',
                    visible: false,
                    likes: 50,
                    duration: 4000,
                })
                .set('Cookie', adminCookie)
                .expect(200);
            expect(body).toEqual({
                ...track,
                title: 'Updated title',
                visible: false,
                likes: 50,
                duration: 4000,
                updatedAt: expect.anything(),
            });
            expect(body.updatedAt > track.updatedAt).toBeTruthy();
        });

        it('should update track file', async () => {
            const track = await createTrack(app, adminCookie);
            const file = await fileUpload(app, adminCookie);

            const { body } = await request(app.getHttpServer())
                .patch(`/tracks/${track.id}`)
                .send({
                    title: 'Updated title',
                    visible: false,
                    likes: 50,
                    duration: 4000,
                    file,
                })
                .set('Cookie', adminCookie)
                .expect(200);
            expect(body).toEqual({
                ...track,
                title: 'Updated title',
                visible: false,
                likes: 50,
                duration: 4000,
                file,
                updatedAt: expect.anything(),
            });
            expect(body.updatedAt > track.updatedAt).toBeTruthy();
        });
    });

    describe('DELETE /categories/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).delete('/tracks/1').expect(403);
        });

        it('should remove track', async () => {
            const track = await createTrack(app, adminCookie);
            const { body } = await request(app.getHttpServer()).delete(`/tracks/${track.id}`).set('Cookie', adminCookie).expect(200);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...expectedTrack } = track;
            expect(body).toEqual(expectedTrack);

            await request(app.getHttpServer()).get(`/categories/${track.id}`).set('Cookie', adminCookie).expect(404);

            const filePath = path.resolve(global.__baseDir, 'upload', 'test', track.file.name);

            try {
                fs.readFileSync(filePath);
            } catch (error: any) {
                expect(error.message).toEqual(`ENOENT: no such file or directory, open '${filePath}'`);
            }
        });
    });
});
