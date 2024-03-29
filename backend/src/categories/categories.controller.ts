import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { PaginationQueryDto } from '../lib/common/dtos';

import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, type: CategoryDto })
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.create(body);
  }

  @Get('/list')
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiResponse({ status: 200, type: CategoryDto })
  async getAll(@Query() query: PaginationQueryDto): Promise<{ data: CategoryEntity[]; count: number }> {
    return this.categoryService.getAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: CategoryDto })
  async getById(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findOne(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() body: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove category' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
