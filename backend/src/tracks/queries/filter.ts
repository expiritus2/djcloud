import { GetAllDto } from '../dtos/get-all.dto';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

type OptionsType = { searchFieldName?: string };

export const filterTracks = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    query: GetAllDto,
    { searchFieldName = 'name' }: OptionsType = {},
) => {
    if (query.category && !query.genre) {
        queryBuilder.where('category.value = :category', {
            category: query.category,
        });
    }

    if (query.genre && !query.category) {
        queryBuilder.where('genre.value = :genre', { genre: query.genre });
    }

    if (query.category && query.genre) {
        queryBuilder
            .where('category.value = :category', { category: query.category })
            .andWhere('genre.value = :genre', { genre: query.genre });
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
