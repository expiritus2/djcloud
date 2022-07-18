import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/authentication/users/user.entity';
import { signup, clearTable } from './utils';
import dataSource from '../ormconfig';
import { setCookieSession } from '../src/lib/configs/app/cookieSession';
import { setPipe } from '../src/lib/configs/app/pipes';

jest.setTimeout(30000);

describe('Authentication System', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setPipe(app);
        setCookieSession(app);
        await app.init();

        await clearTable(UserEntity);
    });

    afterEach(async () => {
        await clearTable(UserEntity);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('handles a signup request', async () => {
        const email = 'asdf@asdf.com';
        await signup(app, email, 'asdf');
    });

    it('signup as a new user then get the currently logged in user', async () => {
        const email = 'asdf@asdf.com';
        const { cookie } = await signup(app, email, 'asdf');

        const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200);

        expect(body).toEqual({
            email,
            id: expect.any(Number),
            role: {
                name: 'user',
            },
        });
    });
});
