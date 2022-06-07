import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../lib/common/dtos';
import { simplePaginateQuery } from '../../lib/queries/pagination';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { snakeCase } from 'lodash';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryEntity } from './category.entity';

interface Category {
  id?: number;
  name: string;
  value: string;
}

@Injectable()
export class CategoriesService {
  // eslint-disable-next-line prettier/prettier
  constructor(@InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>) {}

  async find(options: Partial<Category>): Promise<CategoryEntity[]> {
    const category = await this.categoryRepo.find({ where: options });

    if (!category) {
      throw new NotFoundException(
        `Category with options: ${JSON.stringify(options)} not found`,
      );
    }

    return category;
  }

  async findOne(id: string | number): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return category;
  }

  async getAll(
    query: PaginationQueryDto,
  ): Promise<{ data: CategoryEntity[]; count: number }> {
    const queryBuilder = this.categoryRepo.createQueryBuilder('category');
    const paginateQueryBuilder = simplePaginateQuery<CategoryEntity>(
      queryBuilder,
      query,
    );

    const [data, count] = await paginateQueryBuilder.getManyAndCount();
    return { data, count };
  }

  async create(category: CreateCategoryDto): Promise<CategoryEntity> {
    const storedCategory = await this.find({ name: category.name });

    if (storedCategory.length) {
      throw new BadRequestException(
        `Category with name: ${category.name} already exists`,
      );
    }

    const newCategory = this.categoryRepo.create({
      name: category.name,
      value: snakeCase(category.name),
    });
    return this.categoryRepo.save(newCategory);
  }

  async update(
    id: string | number,
    attrs: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);

    Object.assign(category, { ...attrs, value: snakeCase(attrs.name) });

    return this.categoryRepo.save(category);
  }

  async remove(id: string | number): Promise<CategoryEntity> {
    const category = await this.findOne(id);

    return this.categoryRepo.remove(category);
  }
}
