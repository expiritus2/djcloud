import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../lib/common/dtos';
import { simplePaginateQuery } from '../lib/queries/pagination';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { snakeCase } from 'lodash';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { GenreEntity } from './genre.entity';

interface Genre {
    id?: number;
    name: string;
    value: string;
}

@Injectable()
export class GenresService {
    constructor(@InjectRepository(GenreEntity) private genreRepo: Repository<GenreEntity>) {}

    async find(options: Partial<Genre>): Promise<GenreEntity[]> {
        const genre = await this.genreRepo.find({ where: options });

        if (!genre) {
            throw new NotFoundException(`Genre with options: ${JSON.stringify(options)} not found`);
        }

        return genre;
    }

    async findOne(id: string | number): Promise<GenreEntity> {
        const genre = await this.genreRepo.findOne(id);

        if (!genre) {
            throw new NotFoundException(`Genre with id: ${id} not found`);
        }

        return genre;
    }

    async getAll(query: PaginationQueryDto): Promise<{ data: GenreEntity[]; count: number }> {
        const queryBuilder = this.genreRepo.createQueryBuilder('genre');
        const paginateQueryBuilder = simplePaginateQuery<GenreEntity>(queryBuilder, query);

        const [data, count] = await paginateQueryBuilder.getManyAndCount();
        return { data, count };
    }

    async findByName(name: string): Promise<GenreEntity> {
        return this.genreRepo.createQueryBuilder('genre').where('LOWER(name) = LOWER(:name)', { name }).getOne();
    }

    async create(genre: CreateGenreDto): Promise<GenreEntity> {
        const storedGenre = await this.findByName(genre.name);

        if (storedGenre) {
            throw new BadRequestException(`Genre with name: ${genre.name} already exists`);
        }

        const newGenre = this.genreRepo.create({
            name: genre.name,
            value: snakeCase(genre.name),
        });
        return this.genreRepo.save(newGenre);
    }

    async update(id: string | number, attrs: UpdateGenreDto): Promise<GenreEntity> {
        const genre = await this.findOne(id);

        Object.assign(genre, { ...attrs, value: snakeCase(attrs.name) });

        return this.genreRepo.save(genre);
    }

    async remove(id: string | number): Promise<GenreEntity> {
        const genre = await this.findOne(id);

        return this.genreRepo.remove(genre);
    }
}
