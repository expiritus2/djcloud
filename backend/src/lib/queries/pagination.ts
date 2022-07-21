import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { toNumber } from 'lodash';
import { PaginationQueryDto } from '../common/dtos';

export const simplePaginateQuery = <Entity>(
    queryBuilder: SelectQueryBuilder<Entity>,
    query: PaginationQueryDto,
): SelectQueryBuilder<Entity> => {
    const { limit = 10, page, sort, field } = query;

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
