import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { toNumber } from 'lodash';
import { PaginationQueryDto } from '../common/dtos';

type OptionsType = { searchFieldName?: string };

export const simplePaginateQuery = <Entity>(
    queryBuilder: SelectQueryBuilder<Entity>,
    query: PaginationQueryDto,
    { searchFieldName = 'name' }: OptionsType = {},
): SelectQueryBuilder<Entity> => {
    const { search, limit = 10, page, sort, field } = query;
    if (search) {
        queryBuilder.where(`${searchFieldName} iLIKE :search`, {
            search: `%${search}%`,
        });
    }

    if (limit) {
        queryBuilder.take(toNumber(limit));
    }

    if (page) {
        queryBuilder.skip(toNumber(page) * toNumber(limit));
    }

    if (field && sort) {
        queryBuilder.orderBy(`"${field}"`, sort);
    }

    return queryBuilder;
};
