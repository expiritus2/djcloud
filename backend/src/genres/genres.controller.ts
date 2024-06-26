import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { PaginationQueryDto } from '../lib/common/dtos';

import { CreateGenreDto } from './dtos/create-genre.dto';
import { GenreDto } from './dtos/genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { GenreEntity } from './genre.entity';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private genreService: GenresService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create new genre' })
  @ApiResponse({ status: 201, type: GenreDto })
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateGenreDto): Promise<GenreEntity> {
    return this.genreService.create(body);
  }

  @Get('/list')
  @ApiOperation({ summary: 'Get all genres with pagination' })
  @ApiResponse({ status: 200, type: GenreDto })
  async getAll(@Query() query: PaginationQueryDto): Promise<{ data: GenreEntity[]; count: number }> {
    return this.genreService.getAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get genre by id' })
  @ApiResponse({ status: 200, type: GenreDto })
  @UseGuards(AdminGuard)
  async getById(@Param('id') id: number): Promise<GenreEntity> {
    return this.genreService.findOne(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update genre by id' })
  @ApiResponse({ status: 200, type: GenreDto })
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() body: UpdateGenreDto): Promise<GenreEntity> {
    return this.genreService.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove genre' })
  @ApiResponse({ status: 200, type: GenreDto })
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return this.genreService.remove(id);
  }
}
