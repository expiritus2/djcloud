import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { AdminGuard } from '../lib/guards/adminGuard';
import { CanActivate } from '@nestjs/common';
import { PaginationQueryDto } from '../lib/common/dtos';
import { snakeCase } from 'lodash';

describe('GenresController', () => {
    let controller: GenresController;
    let mockGenresService;
    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        mockGenresService = {
            getAll: jest.fn(() => [{ id: 1, name: 'Test Genre', value: 'test_genre' }]),
            create: jest.fn(({ name }) => ({ id: 1, name, value: snakeCase(name) })),
            update: jest.fn((id, { name }) => ({
                id,
                name,
                value: snakeCase(name),
            })),
            findOne: jest.fn(),
            remove: jest.fn((id) => ({
                id,
                name: 'Removed Genre',
                value: 'removed_genre',
            })),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [GenresController],
            providers: [
                {
                    provide: GenresService,
                    useValue: mockGenresService,
                },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue(mockAdminGuard)
            .compile();

        controller = module.get<GenresController>(GenresController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('getAll returns genres', async () => {
            const result = await controller.getAll({} as PaginationQueryDto);
            expect(result).toEqual([{ id: 1, name: 'Test Genre', value: 'test_genre' }]);
        });
    });

    describe('getById', () => {
        it('getById returns genre', async () => {
            const category = {
                id: 1,
                name: 'Genre Name',
                value: 'genre_name',
            };
            mockGenresService.findOne.mockResolvedValueOnce(category);
            const result = await controller.getById('1');
            expect(mockGenresService.findOne).toBeCalledWith('1');
            expect(result).toEqual(category);
        });
    });

    describe('create', () => {
        it('create should create new entity', async () => {
            const result = await controller.create({ name: 'New Genre' });
            expect(result).toEqual({ id: 1, name: 'New Genre', value: 'new_genre' });
        });
    });

    describe('update', () => {
        it('create should create new entity', async () => {
            const result = await controller.update('1', { name: 'Updated Genre' });
            expect(result).toEqual({
                id: '1',
                name: 'Updated Genre',
                value: 'updated_genre',
            });
        });
    });

    describe('update', () => {
        it('create should create new entity', async () => {
            const result = await controller.remove('1');
            expect(result).toEqual({
                id: '1',
                name: 'Removed Genre',
                value: 'removed_genre',
            });
        });
    });
});
