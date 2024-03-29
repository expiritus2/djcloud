import { toNumber } from 'lodash';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { PaginationQueryDto } from '../common/dtos';
import { SortEnum } from '../common/enums';

export const simplePaginateQuery = <Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  query: PaginationQueryDto,
): SelectQueryBuilder<Entity> => {
  const { limit = 10, page } = query;

  if (limit) {
    queryBuilder.take(toNumber(limit));
  }

  if (page) {
    queryBuilder.skip(toNumber(page) * toNumber(limit));
  }

  return queryBuilder;
};

export const simpleSortQuery = <Entity>(queryBuilder: SelectQueryBuilder<Entity>, query: PaginationQueryDto) => {
  const { sort, field } = query;

  if (field && sort) {
    queryBuilder.orderBy(`"${field}"`, sort, sort === SortEnum.ASC ? 'NULLS FIRST' : 'NULLS LAST');
  }

  return queryBuilder;
};
