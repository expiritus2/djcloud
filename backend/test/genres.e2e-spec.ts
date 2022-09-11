import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { snakeCase } from 'lodash';
import request from 'supertest';

import dataSource from '../ormconfig';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/authentication/users/user.entity';
import { GenreDto } from '../src/genres/dtos/genre.dto';
import { GenreEntity } from '../src/genres/genre.entity';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';

import { clearTable, signupAdmin } from './utils';

jest.setTimeout(30000);

describe('Genres management', () => {
    let app: INestApplication;
    const listGenres: GenreDto[] = [];
    let adminCookie;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setPipe(app);
        setCookieSession(app);
        await app.init();

        await clearTable(GenreEntity);
        await clearTable(UserEntity);
    });

    beforeEach(async () => {
        const { cookie } = await signupAdmin(app);
        adminCookie = cookie;
        for (let i = 0; i < 10; i++) {
            const { body } = await request(app.getHttpServer())
                .post('/genres/create')
                .set('Cookie', cookie)
                .send({ name: `Genre ${i}` })
                .expect(201);
            listGenres.push(body);
        }
    });

    afterEach(async () => {
        await clearTable(GenreEntity);
        await clearTable(UserEntity);
        listGenres.length = 0;
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    describe('/genres/create', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).post('/genres/create').expect(403);
        });

        it('should create new genre', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/genres/create')
                .set('Cookie', adminCookie)
                .send({ name: 'New Genre' })
                .expect(201);

            expect(body).toEqual({
                id: expect.anything(),
                name: 'New Genre',
                value: snakeCase('New Genre'),
            });
        });
    });

    describe('/genres/list', () => {
        it('getAll genres with pagination', async () => {
            const limit = 3;
            for (let i = 0; i < Math.round(listGenres.length / limit); i++) {
                const { body: genres } = await request(app.getHttpServer())
                    .get(`/genres/list?limit=${limit}&page=${i}`)
                    .set('Cookie', adminCookie)
                    .expect(200);
                const skip = i * limit;
                const dbGenres = listGenres.slice(skip, skip + limit);
                expect(genres).toEqual({ data: dbGenres, count: 10 });
            }
        });

        it('getAll genres with sorting by id field', async () => {
            const { body: genres1 } = await request(app.getHttpServer())
                .get(`/genres/list?field=id&sort=ASC`)
                .set('Cookie', adminCookie)
                .expect(200);
            const sortedGenresById1 = listGenres.sort((a, b) => a.id - b.id);
            expect(genres1).toEqual({ data: sortedGenresById1, count: 10 });

            const { body: genres2 } = await request(app.getHttpServer())
                .get(`/genres/list?field=id&sort=DESC`)
                .set('Cookie', adminCookie)
                .expect(200);
            const sortedGenresById2 = listGenres.sort((a, b) => b.id - a.id);
            expect(genres2).toEqual({ data: sortedGenresById2, count: 10 });
        });

        it('getAll genres with sorting by name field', async () => {
            const { body: genres1 } = await request(app.getHttpServer())
                .get(`/genres/list?field=name&sort=ASC`)
                .set('Cookie', adminCookie)
                .expect(200);
            const sortedGenresById1 = listGenres.sort((a, b) => a.name.localeCompare(b.name));
            expect(genres1).toEqual({ data: sortedGenresById1, count: 10 });

            const { body: genres2 } = await request(app.getHttpServer())
                .get(`/genres/list?field=id&sort=DESC`)
                .set('Cookie', adminCookie)
                .expect(200);
            const sortedGenresById2 = listGenres.sort((a, b) => b.name.localeCompare(a.name));
            expect(genres2).toEqual({ data: sortedGenresById2, count: 10 });
        });
    });

    describe('GET /genres/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).get('/genres/1').expect(403);
        });
        it('should get genre by id', async () => {
            const { body } = await request(app.getHttpServer())
                .get(`/genres/${listGenres[4].id}`)
                .set('Cookie', adminCookie)
                .expect(200);

            expect(body).toEqual(listGenres[4]);
        });
    });

    describe('PATCH /genres/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).patch('/genres/1').expect(403);
        });

        it('should update genre', async () => {
            const updateGenre = listGenres[4];
            const newGenreName = 'New Updated Genre';
            const { body } = await request(app.getHttpServer())
                .patch(`/genres/${updateGenre.id}`)
                .send({ name: newGenreName })
                .set('Cookie', adminCookie)
                .expect(200);
            expect(body).toEqual({
                id: updateGenre.id,
                name: newGenreName,
                value: snakeCase(newGenreName),
            });
        });
    });

    describe('DELETE /genres/:id', () => {
        it('should throw forbidden error if user is not admin', async () => {
            await request(app.getHttpServer()).delete('/genres/1').expect(403);
        });

        it('should remove genre', async () => {
            const removedGenre = listGenres[4];
            const { body } = await request(app.getHttpServer())
                .delete(`/genres/${removedGenre.id}`)
                .set('Cookie', adminCookie)
                .expect(200);

            expect(body).toEqual({
                name: removedGenre.name,
                value: removedGenre.value,
            });

            await request(app.getHttpServer()).get(`/genres/${removedGenre.id}`).set('Cookie', adminCookie).expect(404);
        });
    });
});
