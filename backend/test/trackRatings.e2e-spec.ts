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
import { TrackRatingEntity } from '../src/trackRatings/trackRating.entity';
import { TrackEntity } from '../src/tracks/track.entity';

import { createTrack, removeFile } from './utils/tracks';
import { clearTable, createCategories, createGenres, signupAdmin } from './utils';

global.__baseDir = path.resolve(__dirname, '..');

jest.setTimeout(30000);

describe('TrackRatings management', () => {
  let app: INestApplication;
  let adminCookie;
  let track;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setPipe(app);
    setCookieSession(app);
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
  });

  beforeEach(async () => {
    const { createdTrack } = await createTrack(app, adminCookie);
    track = createdTrack;
  });

  afterEach(async () => {
    await clearTable(TrackRatingEntity);
    await clearTable(TrackEntity);
    await removeFile(app, adminCookie, track.file.id);
  });

  afterAll(async () => {
    await clearTable(CategoryEntity);
    await clearTable(GenreEntity);
    await clearTable(TrackRatingEntity);
    await clearTable(FileEntity);
    await clearTable(UserEntity);
    await dataSource.destroy();
  });

  describe('/trackRatings/add', () => {
    it('should add new rating', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/trackRatings/add')
        .send({ trackId: track.id, rating: 10 })
        .expect(201);

      expect(body).toEqual({
        rating: 10,
        trackId: track.id,
        countRatings: 1,
        isDidRating: true,
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
          isDidRating: false,
        });
      }
    });
  });
});
