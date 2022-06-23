import path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearTable, clearTestUploads, createCategories, createGenres, signupAdmin } from './utils';
import { getConnection } from 'typeorm';
import { CategoryEntity } from '../src/categories/category.entity';
import { UserEntity } from '../src/users/user.entity';
import { GenreEntity } from '../src/genres/genre.entity';
import { TrackRatingEntity } from '../src/trackRatings/trackRating.entity';
import { FileEntity } from '../src/tracks/file.entity';
import { createTrack } from './utils/tracks';
import { TrackEntity } from '../src/tracks/track.entity';

global.__baseDir = path.resolve(__dirname, '..');

describe('TrackRatings management', () => {
    let app: INestApplication;
    let adminCookie;
    let track;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        await clearTable(TrackEntity);
        await clearTable(CategoryEntity);
        await clearTable(GenreEntity);
        await clearTable(TrackRatingEntity);
        await clearTable(FileEntity);
        await clearTable(UserEntity);

        await createGenres();
        await createCategories();
        const { cookie } = await signupAdmin(app);
        adminCookie = cookie;

        track = await createTrack(app, adminCookie);
    });

    afterEach(async () => {
        await clearTable(TrackRatingEntity);
        await clearTestUploads();
    });

    afterAll(async () => {
        await clearTable(TrackEntity);
        await clearTable(CategoryEntity);
        await clearTable(GenreEntity);
        await clearTable(TrackRatingEntity);
        await clearTable(FileEntity);
        await clearTable(UserEntity);
        const conn = getConnection();
        await conn.close();
    });

    describe('/trackRatings/add', () => {
        it('should add new rating', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/trackRatings/add')
                .send({ trackId: track.id, rating: 10 })
                .expect(201);

            expect(body).toEqual({
                id: expect.anything(),
                rating: 10,
                track: {
                    createdAt: track.createdAt,
                    updatedAt: track.updatedAt,
                    duration: 411.95102,
                    id: track.id,
                    title: track.title,
                    visible: track.visible,
                },
            });
        });
    });

    describe('/trackRatings/:trackId', () => {
        it('should get trackRatings by track id', async () => {
            for (let i = 0; i < 3; i++) {
                await request(app.getHttpServer())
                    .post(`/trackRatings/add`)
                    .send({ trackId: track.id, rating: i + 1 })
                    .expect(201);
            }

            const { body: ratings } = await request(app.getHttpServer()).get(`/trackRatings/${track.id}`).expect(200);

            for (let i = 0; i < 3; i++) {
                const rating = ratings[i];
                expect(rating).toEqual({
                    id: expect.anything(),
                    rating: i + 1,
                    track: expect.objectContaining({
                        id: track.id,
                        title: track.title,
                        visible: track.visible,
                    }),
                });
            }
        });
    });
});
