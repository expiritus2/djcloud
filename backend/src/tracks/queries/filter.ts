import { GetAllDto } from '../dtos/get-all.dto';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { TrackEntity } from '../track.entity';

export const filterTracks = (queryBuilder: SelectQueryBuilder<TrackEntity>, query: GetAllDto) => {
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

    return queryBuilder;
};
