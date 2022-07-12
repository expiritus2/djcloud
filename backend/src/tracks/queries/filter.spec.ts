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
        const query = { category: 'categoryName' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: 'categoryName' });
    });

    it('should filter by genre', () => {
        const query = { genre: 'genreName' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).not.toBeCalledWith('category.value = :category', { category: 'categoryName' });
        expect(mockQueryBuilder.where).toBeCalledWith('genre.value = :genre', { genre: query.genre });
        expect(mockQueryBuilder.andWhere).not.toBeCalledWith('track.visible = :visible', { visible: query.visible });
    });

    it('should filter by category and genre', () => {
        const query = { category: 'categoryName', genre: 'genreName' } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: 'categoryName' });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('genre.value = :genre', { genre: query.genre });
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

    it('should filter by all fields', () => {
        const query = { category: 'categoryName', genre: 'genreName', visible: true } as any;

        filterTracks(mockQueryBuilder, query);

        expect(mockQueryBuilder.where).toBeCalledWith('category.value = :category', { category: query.category });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('genre.value = :genre', { genre: query.genre });
        expect(mockQueryBuilder.andWhere).toBeCalledWith('track.visible = :visible', { visible: query.visible });
    });
});
