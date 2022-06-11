import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getFakeConfigService } from '../../../lib/testData/utils';
import { getHashPassword } from '../utils';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;
    let fakeConfigService: Partial<ConfigService>;

    beforeEach(async () => {
        const users: UserEntity[] = [];
        fakeUserService = getFakeUserService(users);
        fakeConfigService = getFakeConfigService();

        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUserService }, { provide: ConfigService, useValue: fakeConfigService }],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    describe('signup', () => {
        it('signup should throw error if email already in use', async () => {
            fakeUserService.find = (email) => {
                return Promise.resolve([{ id: 1, email }] as UserEntity[]);
            };

            try {
                await service.signup('asdf@asdf.com', 'asdf');
            } catch (err) {
                expect(err instanceof BadRequestException).toBeTruthy();
                expect(err.message).toEqual('Email in use');
            }
        });

        it('should create and return user', async () => {
            const email = 'asdf@asdf.com';
            const password = 'asdf';
            const user = await service.signup(email, password);

            const hashPassword = await getHashPassword(password, getFakeConfigService().get('SALT'));

            expect(user).toEqual({
                id: expect.anything(),
                email,
                password: hashPassword,
            });
        });
    });

    describe('signin', () => {
        it('should throw error if user not found', async () => {
            fakeUserService.find = () => {
                return Promise.resolve([] as UserEntity[]);
            };

            try {
                await service.signin('asdf@asdf.com', 'asdf');
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('User not found');
            }
        });

        it('should throw error if password not right', async () => {
            const email = 'asdf@asdf.com';
            const password = 'asdf';

            const storedHashPassword = await getHashPassword(password, getFakeConfigService().get('SALT'));

            fakeUserService.find = () => {
                return Promise.resolve([{ id: 1, email, password: storedHashPassword }] as UserEntity[]);
            };

            const user = await service.signin(email, password);

            expect(user).toEqual({
                id: expect.anything(),
                email,
                password: storedHashPassword,
            });
        });

        it('should authorize user', async () => {
            const email = 'asdf@asdf.com';
            const password = 'asdf';

            const storedHashPassword = await getHashPassword(password, getFakeConfigService().get('SALT'));

            fakeUserService.find = () => {
                return Promise.resolve([{ id: 1, email, password: storedHashPassword }] as UserEntity[]);
            };

            try {
                await service.signin(email, 'notValid');
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toEqual('Email or password not valid');
            }
        });
    });
});

const getFakeUserService = (users: UserEntity[]) => {
    return {
        find: (email) => {
            const filteredUsers = users.filter((user) => user.email === email);
            return Promise.resolve(filteredUsers);
        },
        create: (email, password) => {
            const id = Math.floor(Math.random() * 999999);
            const user = { id, email, password } as UserEntity;
            users.push(user);
            return Promise.resolve(user);
        },
    };
};
