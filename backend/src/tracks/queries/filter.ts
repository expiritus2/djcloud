import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { GetAllDto } from '../dtos/get-all.dto';

type OptionsType = { searchFieldName?: string };

export const filterTracks = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    query: GetAllDto,
    { searchFieldName = 'name' }: OptionsType = {},
) => {
    if (query.categoryId && !query.genreId) {
        queryBuilder.where('category.id = :category', {
            category: query.categoryId,
        });
    }

    if (query.genreId && !query.categoryId) {
        queryBuilder.where('genre.id = :genre', { genre: query.genreId });
    }

    if (query.categoryId && query.genreId) {
        queryBuilder
            .where('category.id = :category', { category: query.categoryId })
            .andWhere('genre.id = :genre', { genre: query.genreId });
    }

    if (query.visible !== undefined) {
        queryBuilder.andWhere('track.visible = :visible', { visible: query.visible });
    }

    if (query.search) {
        queryBuilder.andWhere(`${searchFieldName} iLIKE :search`, {
            search: `%${query.search}%`,
        });
    }

    return queryBuilder;
};
