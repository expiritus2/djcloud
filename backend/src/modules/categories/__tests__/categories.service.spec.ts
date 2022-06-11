import { Test } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mocked } from 'jest-mock';
import { simplePaginateQuery } from '../../../lib/queries/pagination';

jest.mock('../../../lib/queries/pagination');

describe('CategoryService', () => {
    let service: CategoriesService;
    let mockCategoryRepo;
    let mockQueryBuilder;

    beforeEach(async () => {
        mockQueryBuilder = {
            getMany: jest.fn(),
            getManyAndCount: jest.fn(),
            where: jest.fn(),
            skip: jest.fn(),
            order: jest.fn(),
            take: jest.fn(),
        };
        mockCategoryRepo = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };
        const module = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(CategoryEntity),
                    useValue: mockCategoryRepo,
                },
            ],
        }).compile();

        service = module.get(CategoriesService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it('should return found categories', async () => {
            mockCategoryRepo.find.mockImplementation(() => {
                return [{ name: 'Found Category', value: 'found_category' }];
            });
            const categorya = await service.find({ name: 'Search Category' });

            expect(mockCategoryRepo.find).toBeCalledWith({
                where: { name: 'Search Category' },
            });
            expect(categorya).toEqual([{ name: 'Found Category', value: 'found_category' }]);
        });

        it('should throw error if category is not found', async () => {
            mockCategoryRepo.find.mockReturnValueOnce(null);

            try {
                await service.find({ name: 'Search Category' });
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('Category with options: {"name":"Search Category"} not found');
            }
        });
    });

    describe('findOne', () => {
        it('should return one category', async () => {
            mockCategoryRepo.findOne.mockReturnValueOnce({
                id: 1,
                name: 'Found Category',
                value: 'found_category',
            });
            const category = await service.findOne(1);
            expect(category).toEqual({
                id: 1,
                name: 'Found Category',
                value: 'found_category',
            });
        });

        it('should throw error if category not found', async () => {
            mockCategoryRepo.findOne.mockReturnValueOnce(null);

            try {
                await service.findOne(1);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('Category with id: 1 not found');
            }
        });
    });

    describe('getAll', () => {
        it('should get all categories', async () => {
            const query = {};
            mocked(simplePaginateQuery).mockReturnValueOnce(mockQueryBuilder);
            mockQueryBuilder.getManyAndCount.mockReturnValueOnce([{ id: 1, name: 'Category Name', value: 'category_name' }, 1]);
            const categories = await service.getAll({});

            expect(mockCategoryRepo.createQueryBuilder).toBeCalledWith('category');
            expect(simplePaginateQuery).toBeCalledWith(mockQueryBuilder, query);
            expect(mockQueryBuilder.getManyAndCount).toBeCalled();
            expect(categories).toEqual({
                data: { id: 1, name: 'Category Name', value: 'category_name' },
                count: 1,
            });
        });
    });

    describe('create', () => {
        const newCategory = {
            name: 'New Category',
            value: 'new_category',
        };

        it('should create and return category', async () => {
            mockCategoryRepo.find.mockReturnValueOnce([]);
            mockCategoryRepo.create.mockReturnValueOnce(newCategory);
            mockCategoryRepo.save.mockReturnValue(newCategory);

            const category = await service.create(newCategory);

            expect(mockCategoryRepo.find).toBeCalledWith({
                where: { name: newCategory.name },
            });
            expect(mockCategoryRepo.create).toBeCalledWith(newCategory);
            expect(mockCategoryRepo.save).toBeCalledWith(newCategory);
            expect(category).toEqual(newCategory);
        });

        it('should throw error if category already exists', async () => {
            mockCategoryRepo.find.mockReturnValueOnce([newCategory]);

            try {
                await service.create(newCategory);
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toEqual('Category with name: New Category already exists');
            }
        });
    });

    describe('update', () => {
        it('should update category name and generate new value', async () => {
            mockCategoryRepo.findOne.mockReturnValue({
                id: 1,
                name: 'Old Category',
                value: 'old_category',
            });
            await service.update(1, { name: 'New Category' });

            expect(mockCategoryRepo.save).toBeCalledWith({
                id: 1,
                name: 'New Category',
                value: 'new_category',
            });
        });
    });

    describe('remove', () => {
        it('should remove and return category', async () => {
            const category = { name: 'Category Name', value: 'category_name' };
            mockCategoryRepo.findOne.mockReturnValueOnce(category);
            mockCategoryRepo.remove.mockReturnValueOnce(category);

            const removedCategory = await service.remove(1);

            expect(mockCategoryRepo.remove).toBeCalledWith(category);
            expect(removedCategory).toEqual(category);
        });
    });
});
