import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { UserEntity } from '../../src/modules/users/user.entity';
import { RoleEntity } from '../../src/modules/roles/role.entity';
import { RolesEnum } from '../../src/modules/roles/roles.enum';

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
    const connection = getConnection();
    const userRepo = await connection.getRepository(UserEntity);
    const role = await connection.getRepository(RoleEntity).findOne({ name: RolesEnum.ADMIN });
    const createdAdmin = await userRepo.create({
        email: 'test@email.com',
        password: '486e9b3962de2e17c1c399596d1ffd508bf163cdaf7ec38cb22694e44c016093',
        role,
    });
    await userRepo.save(createdAdmin);
};

export const signupAdmin = async (app: INestApplication) => {
    await createAdminUser();
    return signin(app, 'test@email.com', 'Qwerty123');
};
