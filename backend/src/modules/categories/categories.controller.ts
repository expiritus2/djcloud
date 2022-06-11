import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dtos/category.dto';
import { AdminGuard } from '../../lib/guards/adminGuard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './category.entity';
import { PaginationQueryDto } from '../../lib/common/dtos';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@ApiTags('Categories')
@UseGuards(AdminGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Post('/create')
    @ApiOperation({ summary: 'Create new category' })
    @ApiResponse({ status: 201, type: CategoryDto })
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
    async getById(@Param('id') id: string): Promise<CategoryEntity> {
        return this.categoryService.findOne(id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update category by id' })
    @ApiResponse({ status: 200, type: CategoryDto })
    async update(@Param('id') id: string, @Body() body: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.categoryService.update(id, body);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Remove category' })
    @ApiResponse({ status: 200, type: CategoryDto })
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
