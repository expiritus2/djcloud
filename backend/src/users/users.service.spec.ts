import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { RoleEntity } from '../roles/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let mockUserRepo;
    let mockRoleRepo;

    beforeEach(async () => {
        mockUserRepo = {
            create: jest.fn((params) => ({ id: 1, ...params })),
            save: jest.fn((params) => params),
            remove: jest.fn((params) => params),
            findOne: jest.fn(() => ({
                id: 1,
                email: 'test@email.com',
                password: '1234',
                role: { id: 1, name: 'user' },
            })),
            find: jest.fn(() => [{ id: 1, email: 'test@email.com', role: { id: 1, name: 'user' } }]),
        };
        mockRoleRepo = {
            findOne: jest.fn(({ name }) => ({ id: 1, name })),
        };
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserRepo,
                },
                {
                    provide: getRepositoryToken(RoleEntity),
                    useValue: mockRoleRepo,
                },
            ],
        }).compile();

        service = module.get(UsersService);
    });

    it('can create an instance of users service', async () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create user', async () => {
            const result = await service.create('asdf@asdf.com', 'asdf');
            expect(result).toEqual({
                id: expect.anything(),
                email: 'asdf@asdf.com',
                password: 'asdf',
                role: { id: 1 },
            });
        });
    });

    describe('findOne', () => {
        it('should findOne by id', async () => {
            const result = await service.findOne(1);

            expect(result).toEqual({
                id: 1,
                email: 'test@email.com',
                password: '1234',
                role: { id: 1, name: 'user' },
            });
        });

        it('should throw error if user not exists', async () => {
            mockUserRepo.findOne.mockReturnValueOnce(null);

            try {
                await service.findOne(1);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('User with id: 1 is not exists');
            }
        });
    });

    describe('find', () => {
        it('should call usersRepo.find method', async () => {
            mockUserRepo.find = jest.fn();
            mockUserRepo.find.mockReturnValueOnce([{ id: 1, email: 'asdf@asdf.com' }]);

            await service.find({ email: 'asdf@asdf.com' });

            expect(mockUserRepo.find).toBeCalledWith({
                where: { email: 'asdf@asdf.com' },
                relations: ['role'],
            });
        });
    });

    describe('remove', () => {
        it('should remove user', async () => {
            const result = await service.remove(1);
            expect(result).toEqual({
                email: 'test@email.com',
                id: 1,
                password: '1234',
                role: {
                    id: 1,
                    name: 'user',
                },
            });
        });
    });
});
