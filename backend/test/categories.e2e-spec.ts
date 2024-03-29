import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { snakeCase } from 'lodash';
import request from 'supertest';

import dataSource from '../ormconfig';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/authentication/users/user.entity';
import { CategoryEntity } from '../src/categories/category.entity';
import { CategoryDto } from '../src/categories/dtos/category.dto';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';

import { clearTable, signupAdmin } from './utils';

jest.setTimeout(30000);

describe('Categories management', () => {
  let app: INestApplication;
  const listCategories: CategoryDto[] = [];
  let adminCookie;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setPipe(app);
    setCookieSession(app);
    await app.init();

    await clearTable(CategoryEntity);
    await clearTable(UserEntity);

    const { cookie } = await signupAdmin(app);
    adminCookie = cookie;
  });

  beforeEach(async () => {
    for (let i = 0; i < 10; i++) {
      const { body } = await request(app.getHttpServer())
        .post('/categories/create')
        .set('Cookie', adminCookie)
        .send({ name: `Category ${i}` })
        .expect(201);
      listCategories.push(body);
    }
  });

  afterEach(async () => {
    await clearTable(CategoryEntity);
    listCategories.length = 0;
  });

  afterAll(async () => {
    await clearTable(UserEntity);
    await dataSource.destroy();
  });

  describe('/categories/create', () => {
    it('should throw forbidden error if user is not admin', async () => {
      await request(app.getHttpServer()).post('/categories/create').expect(403);
    });

    it('should create new category', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/categories/create')
        .set('Cookie', adminCookie)
        .send({ name: 'New Category' })
        .expect(201);

      expect(body).toEqual({
        id: expect.anything(),
        name: 'New Category',
        value: snakeCase('New Category'),
      });
    });
  });

  describe('/categories/list', () => {
    it('getAll categories with pagination', async () => {
      const limit = 3;
      for (let i = 0; i < Math.round(listCategories.length / limit); i++) {
        const { body: categories } = await request(app.getHttpServer())
          .get(`/categories/list?limit=${limit}&page=${i}`)
          .set('Cookie', adminCookie)
          .expect(200);
        const skip = i * limit;
        const dbCategories = listCategories.slice(skip, skip + limit);
        expect(categories).toEqual({ data: dbCategories, count: 10 });
      }
    });

    it('getAll categories with sorting by id field', async () => {
      const { body: categories1 } = await request(app.getHttpServer())
        .get(`/categories/list?field=id&sort=ASC`)
        .set('Cookie', adminCookie)
        .expect(200);
      const sortedCategoriesById1 = listCategories.sort((a, b) => a.id - b.id);
      expect(categories1).toEqual({ data: sortedCategoriesById1, count: 10 });

      const { body: categories2 } = await request(app.getHttpServer())
        .get(`/categories/list?field=id&sort=DESC`)
        .set('Cookie', adminCookie)
        .expect(200);
      const sortedCategoriesById2 = listCategories.sort((a, b) => b.id - a.id);
      expect(categories2).toEqual({ data: sortedCategoriesById2, count: 10 });
    });

    it('getAll categories with sorting by name field', async () => {
      const { body: categories1 } = await request(app.getHttpServer())
        .get(`/categories/list?field=name&sort=ASC`)
        .set('Cookie', adminCookie)
        .expect(200);
      const sortedCategoriesById1 = listCategories.sort((a, b) => a.name.localeCompare(b.name));
      expect(categories1).toEqual({ data: sortedCategoriesById1, count: 10 });

      const { body: categories2 } = await request(app.getHttpServer())
        .get(`/categories/list?field=id&sort=DESC`)
        .set('Cookie', adminCookie)
        .expect(200);
      const sortedCategoriesById2 = listCategories.sort((a, b) => b.name.localeCompare(a.name));
      expect(categories2).toEqual({ data: sortedCategoriesById2, count: 10 });
    });
  });

  describe('GET /categories/:id', () => {
    it('should get category by id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/categories/${listCategories[4].id}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(body).toEqual(listCategories[4]);
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should throw forbidden error if user is not admin', async () => {
      await request(app.getHttpServer()).patch('/categories/1').expect(403);
    });

    it('should update category', async () => {
      const updateCategory = listCategories[4];
      const newCategoryName = 'New Updated Category';
      const { body } = await request(app.getHttpServer())
        .patch(`/categories/${updateCategory.id}`)
        .send({ name: newCategoryName })
        .set('Cookie', adminCookie)
        .expect(200);
      expect(body).toEqual({
        id: updateCategory.id,
        name: newCategoryName,
        value: snakeCase(newCategoryName),
      });
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should throw forbidden error if user is not admin', async () => {
      await request(app.getHttpServer()).delete('/categories/1').expect(403);
    });

    it('should remove category', async () => {
      const removedCategory = listCategories[4];
      const { body } = await request(app.getHttpServer())
        .delete(`/categories/${removedCategory.id}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(body).toEqual({
        name: removedCategory.name,
        value: removedCategory.value,
      });

      await request(app.getHttpServer())
        .get(`/categories/${removedCategory.id}`)
        .set('Cookie', adminCookie)
        .expect(404);
    });
  });
});
