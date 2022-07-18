import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { CanActivate } from '@nestjs/common';
import { PaginationQueryDto } from '../lib/common/dtos';
import { snakeCase } from 'lodash';

describe('CategoriesController', () => {
    let controller: CategoriesController;
    let mockCategoriesService;
    const mockAdminGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        mockCategoriesService = {
            getAll: jest.fn(() => [{ id: 1, name: 'Test Category', value: 'test_category' }]),
            create: jest.fn(({ name }) => ({ id: 1, name, value: snakeCase(name) })),
            update: jest.fn((id, { name }) => ({
                id,
                name,
                value: snakeCase(name),
            })),
            findOne: jest.fn(),
            remove: jest.fn((id) => ({
                id,
                name: 'Removed Category',
                value: 'removed_category',
            })),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                {
                    provide: CategoriesService,
                    useValue: mockCategoriesService,
                },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue(mockAdminGuard)
            .compile();

        controller = module.get<CategoriesController>(CategoriesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('getAll returns categories', async () => {
            const result = await controller.getAll({
                limit: '10',
            } as PaginationQueryDto);
            expect(result).toEqual([{ id: 1, name: 'Test Category', value: 'test_category' }]);
        });
    });

    describe('getById', () => {
        it('getById returns category', async () => {
            const category = {
                id: 1,
                name: 'Category Name',
                value: 'category_name',
            };
            mockCategoriesService.findOne.mockResolvedValueOnce(category);
            const result = await controller.getById(1);
            expect(mockCategoriesService.findOne).toBeCalledWith(1);
            expect(result).toEqual(category);
        });
    });

    describe('create', () => {
        it('create should create new entity', async () => {
            const result = await controller.create({ name: 'New Category' });
            expect(result).toEqual({
                id: 1,
                name: 'New Category',
                value: 'new_category',
            });
        });
    });

    describe('update', () => {
        it('create should create new entity', async () => {
            const result = await controller.update(1, { name: 'Updated Category' });
            expect(result).toEqual({
                id: 1,
                name: 'Updated Category',
                value: 'updated_category',
            });
        });
    });

    describe('update', () => {
        it('create should create new entity', async () => {
            const result = await controller.remove(1);
            expect(result).toEqual({
                id: 1,
                name: 'Removed Category',
                value: 'removed_category',
            });
        });
    });
});
