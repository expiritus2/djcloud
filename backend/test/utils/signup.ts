import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserEntity } from '../../src/users/user.entity';
import { RoleEntity } from '../../src/roles/role.entity';
import { RolesEnum } from '../../src/roles/roles.enum';
import dataSource from '../../ormconfig';

export const signup = async (app: INestApplication, email: string, password: string) => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send({ email, password }).expect(201);

    return {
        cookie: res.get('Set-Cookie'),
    };
};

export const signin = async (app: INestApplication, email: string, password: string) => {
    const res = await request(app.getHttpServer()).post('/auth/signin').send({ email, password }).expect(200);

    return {
        cookie: res.get('Set-Cookie'),
    };
};

const createAdminUser = async () => {
    const userRepo = await dataSource.getRepository(UserEntity);
    const role = await dataSource.getRepository(RoleEntity).findOne({ where: { name: RolesEnum.ADMIN } });
    const createdAdmin = await userRepo.create({
        email: 'test@email.com',
        password: '6bc5655cd635355edbdc640c3809210770b89dcc36d66a1a687ee2b8c39208e6',
        role,
    });
    await userRepo.save(createdAdmin);
};

export const signupAdmin = async (app: INestApplication) => {
    await createAdminUser();
    return signin(app, 'test@email.com', 'Qwerty123');
};
