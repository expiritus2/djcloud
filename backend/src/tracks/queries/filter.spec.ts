import { filterTracks } from './filter';

describe('filter', () => {
    let mockQueryBuilder;

    beforeEach(() => {
        mockQueryBuilder = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
        };
    });

    it('should filter by category', () => {
        const query = { categoryId: 'categoryId' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.id = :category', { category: query.categoryId });
    });

    it('should filter by genre', () => {
        const query = { genreId: 'genreId' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).not.toBeCalledWith('category.id = :category', { categoryId: 'categoryId' });
        expect(mockQueryBuilder.where).toBeCalledWith('genre.id = :genre', { genre: query.genreId });
        expect(mockQueryBuilder.andWhere).not.toBeCalledWith('track.visible = :visible', { visible: query.visible });
    });

    it('should filter by category and genre', () => {
        const query = { categoryId: 'categoryId', genreId: 'genreId' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.id = :category', { category: query.categoryId });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('genre.id = :genre', { genre: query.genreId });
    });

    it('should filter by visible value: true', () => {
        const query = { category: 'categoryName', visible: true } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: query.visible });
    });

    it('should filter by visible value: false', () => {
        const query = { category: 'categoryName', visible: false } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: query.visible });
    });

    it('should filter by search', () => {
        const query = { search: 'some search' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.andWhere).toBeCalledWith(`name iLIKE :search`, {
            search: `%${query.search}%`,
        });
    });

    it('should filter by search with custom searchFieldName', () => {
        const query = { search: 'some search' } as any;

        filterTracks(mockQueryBuilder, query, { searchFieldName: 'customFieldName' });

        expect(mockQueryBuilder.andWhere).toBeCalledWith(`customFieldName iLIKE :search`, {
            search: `%${query.search}%`,
        });
    });

    it('should filter by all fields', () => {
        const query = { categoryId: 'categoryId', genreId: 'genreId', visible: true, search: 'some search' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.id = :category', { category: query.categoryId });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('genre.id = :genre', { genre: query.genreId });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: query.visible });
        expect(mockQueryBuilder.andWhere).toBeCalledWith(`name iLIKE :search`, {
            search: `%${query.search}%`,
        });
    });
});
