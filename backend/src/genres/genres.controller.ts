import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../lib/guards/adminGuard';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { GenresService } from './genres.service';
import { GenreDto } from './dtos/genre.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenreEntity } from './genre.entity';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { PaginationQueryDto } from '../lib/common/dtos';

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
    async getById(@Param('id') id: string): Promise<GenreEntity> {
        return this.genreService.findOne(id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update genre by id' })
    @ApiResponse({ status: 200, type: GenreDto })
    @UseGuards(AdminGuard)
    async update(@Param('id') id: string, @Body() body: UpdateGenreDto): Promise<GenreEntity> {
        return this.genreService.update(id, body);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Remove genre' })
    @ApiResponse({ status: 200, type: GenreDto })
    @UseGuards(AdminGuard)
    async remove(@Param('id') id: string) {
        return this.genreService.remove(id);
    }
}
