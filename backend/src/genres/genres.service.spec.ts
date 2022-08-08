import { Test } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenreEntity } from './genre.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mocked } from 'jest-mock';
import { simplePaginateQuery } from '../lib/queries/pagination';

jest.mock('../lib/queries/pagination');

describe('GenreService', () => {
    let service: GenresService;
    let mockGenreRepo;
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
        mockGenreRepo = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findByName: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };
        const module = await Test.createTestingModule({
            providers: [
                GenresService,
                {
                    provide: getRepositoryToken(GenreEntity),
                    useValue: mockGenreRepo,
                },
            ],
        }).compile();

        service = module.get(GenresService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it('should return found genres', async () => {
            mockGenreRepo.find.mockImplementation(() => {
                return [{ name: 'Found Genre', value: 'found_genre' }];
            });
            const genrea = await service.find({ name: 'Search Genre' });

            expect(mockGenreRepo.find).toBeCalledWith({
                where: { name: 'Search Genre' },
            });
            expect(genrea).toEqual([{ name: 'Found Genre', value: 'found_genre' }]);
        });

        it('should throw error if genre is not found', async () => {
            mockGenreRepo.find.mockReturnValueOnce(null);

            try {
                await service.find({ name: 'Search Genre' });
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('Genre with options: {"name":"Search Genre"} not found');
            }
        });
    });

    describe('findOne', () => {
        it('should return one genre', async () => {
            mockGenreRepo.findOne.mockReturnValueOnce({
                id: 1,
                name: 'Found Genre',
                value: 'found_genre',
            });
            const genre = await service.findOne(1);
            expect(genre).toEqual({
                id: 1,
                name: 'Found Genre',
                value: 'found_genre',
            });
        });

        it('should throw error if genre not found', async () => {
            mockGenreRepo.findOne.mockReturnValueOnce(null);

            try {
                await service.findOne(1);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('Genre with id: 1 not found');
            }
        });
    });

    describe('getAll', () => {
        it('should get all genres', async () => {
            const query = {};
            mocked(simplePaginateQuery).mockReturnValueOnce(mockQueryBuilder);
            mockQueryBuilder.getManyAndCount.mockReturnValueOnce([
                { id: 1, name: 'Genre Name', value: 'genre_name' },
                1,
            ]);
            const genres = await service.getAll({});

            expect(mockGenreRepo.createQueryBuilder).toBeCalledWith('genre');
            expect(simplePaginateQuery).toBeCalledWith(mockQueryBuilder, query);
            expect(mockQueryBuilder.getManyAndCount).toBeCalled();
            expect(genres).toEqual({
                data: { id: 1, name: 'Genre Name', value: 'genre_name' },
                count: 1,
            });
        });
    });

    describe('findByName', () => {
        it('should get genre by name', async () => {
            const genre = { id: 1, name: 'Genre', value: 'genre' };
            mockQueryBuilder.getOne.mockResolvedValueOnce(genre);

            const result = await service.findByName('test name');

            expect(mockGenreRepo.createQueryBuilder).toBeCalledWith('genre');
            expect(mockQueryBuilder.where).toBeCalledWith('name iLIKE :name', { name: '%test name%' });
            expect(mockQueryBuilder.getOne).toBeCalled();
            expect(result).toEqual(genre);
        });
    });

    describe('create', () => {
        const newGenre = {
            name: 'New Genre',
            value: 'new_genre',
        };

        it('should create and return genre', async () => {
            mockGenreRepo.create.mockReturnValueOnce(newGenre);
            mockGenreRepo.save.mockReturnValue(newGenre);
            mockQueryBuilder.getOne.mockResolvedValueOnce(null);

            const genre = await service.create(newGenre);

            expect(mockGenreRepo.createQueryBuilder).toBeCalledWith('genre');
            expect(mockQueryBuilder.where).toBeCalledWith('name iLIKE :name', { name: newGenre.name });
            expect(mockQueryBuilder.getOne).toBeCalled();
            expect(mockGenreRepo.create).toBeCalledWith(newGenre);
            expect(mockGenreRepo.save).toBeCalledWith(newGenre);
            expect(genre).toEqual(newGenre);
        });

        it('should throw error if genre already exists', async () => {
            jest.spyOn(GenresService.prototype, 'findByName').mockResolvedValueOnce(newGenre as any);

            try {
                await service.create(newGenre);
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toEqual('Genre with name: New Genre already exists');
            }
        });
    });

    describe('update', () => {
        it('should update genre name and generate new value', async () => {
            mockGenreRepo.findOne.mockReturnValue({
                id: 1,
                name: 'Old Genre',
                value: 'old_genre',
            });
            await service.update(1, { name: 'New Genre' });

            expect(mockGenreRepo.save).toBeCalledWith({
                id: 1,
                name: 'New Genre',
                value: 'new_genre',
            });
        });
    });

    describe('remove', () => {
        it('should remove and return genre', async () => {
            const genre = { name: 'Genre Name', value: 'genre_name' };
            mockGenreRepo.findOne.mockReturnValueOnce(genre);
            mockGenreRepo.remove.mockReturnValueOnce(genre);

            const removedGenre = await service.remove(1);

            expect(mockGenreRepo.remove).toBeCalledWith(genre);
            expect(removedGenre).toEqual(genre);
        });
    });
});
