import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocked } from 'jest-mock';

import { simplePaginateQuery } from '../lib/queries/pagination';

import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';

jest.mock('../lib/queries/pagination');

describe('CategoryService', () => {
  let service: CategoriesService;
  let mockCategoryRepo;
  let mockQueryBuilder;

  beforeEach(async () => {
    mockQueryBuilder = {
      getMany: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
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
      mockQueryBuilder.getManyAndCount.mockReturnValueOnce([
        [{ id: 1, name: 'Category Name', value: 'category_name' }],
        1,
      ]);
      const categories = await service.getAll({});

      expect(mockCategoryRepo.createQueryBuilder).toBeCalledWith('category');
      expect(simplePaginateQuery).toBeCalledWith(mockQueryBuilder, query);
      expect(mockQueryBuilder.getManyAndCount).toBeCalled();
      expect(categories).toEqual({
        data: [{ id: 1, name: 'Category Name', value: 'category_name' }],
        count: 1,
      });
    });
  });

  describe('findByName', () => {
    it('should get category by name', async () => {
      const category = { id: 1, name: 'Category', value: 'category' };
      mockQueryBuilder.getOne.mockResolvedValueOnce(category);

      const result = await service.findByName('test name');

      expect(mockCategoryRepo.createQueryBuilder).toBeCalledWith('category');
      expect(mockQueryBuilder.where).toBeCalledWith('name iLIKE :name', { name: `%test name%` });
      expect(mockQueryBuilder.getOne).toBeCalled();
      expect(result).toEqual(category);
    });
  });

  describe('create', () => {
    const newCategory = {
      name: 'New Category',
      value: 'new_category',
    };

    it('should create and return category', async () => {
      mockCategoryRepo.create.mockReturnValueOnce(newCategory);
      mockCategoryRepo.save.mockReturnValue(newCategory);
      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      const category = await service.create(newCategory);

      expect(mockCategoryRepo.createQueryBuilder).toBeCalledWith('category');
      expect(mockQueryBuilder.where).toBeCalledWith('name iLIKE :name', { name: category.name });
      expect(mockQueryBuilder.getOne).toBeCalled();
      expect(mockCategoryRepo.create).toBeCalledWith(newCategory);
      expect(mockCategoryRepo.save).toBeCalledWith(newCategory);
      expect(category).toEqual(newCategory);
    });

    it('should throw error if category already exists', async () => {
      jest.spyOn(CategoriesService.prototype, 'findByName').mockResolvedValueOnce(newCategory as any);

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
