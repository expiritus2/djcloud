import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { simplePaginateQuery } from './pagination';
import { PaginationQueryDto } from '../common/dtos';
import { toNumber } from 'lodash';

describe('paginationQuery', () => {
    describe('simplePagination', () => {
        let mockQueryBuilder: Partial<SelectQueryBuilder<any>>;

        beforeEach(() => {
            mockQueryBuilder = {
                where: jest.fn(),
                take: jest.fn(),
                skip: jest.fn(),
                orderBy: jest.fn(),
            };
        });

        it('should include limit query', () => {
            const query = { limit: '10' } as PaginationQueryDto;

            const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

            expect(mockQueryBuilder.take).toBeCalledWith(10);
            expect(queryBuilder).toEqual(mockQueryBuilder);
        });

        it('should include skip number if page is in query', () => {
            const query = { limit: '5' } as PaginationQueryDto;

            for (let i = 0; i < 10; i++) {
                query.page = String(i);

                const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

                const skipNumber = toNumber(query.page) * toNumber(query.limit);
                expect(mockQueryBuilder.skip).toHaveBeenNthCalledWith(i + 1, skipNumber);
                expect(queryBuilder).toEqual(mockQueryBuilder);
            }
        });

        it('should apply default limit 10 if limit not included to the query', () => {
            const query = {} as PaginationQueryDto;

            for (let i = 0; i < 10; i++) {
                query.page = String(i);

                const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

                const skipNumber = toNumber(query.page) * 10;
                expect(mockQueryBuilder.skip).toHaveBeenNthCalledWith(i + 1, skipNumber);
                expect(queryBuilder).toEqual(mockQueryBuilder);
            }
        });

        it('should include orderBy in query only if exists field and sort together', () => {
            const query = { sort: 'ASC', field: 'name' } as PaginationQueryDto;

            const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

            expect(mockQueryBuilder.orderBy).toBeCalledWith(`"${query.field}"`, query.sort, 'NULLS FIRST');
            expect(queryBuilder).toEqual(mockQueryBuilder);
        });

        it('should not include orderBy in query if field not exists', () => {
            const query = { sort: 'ASC' } as PaginationQueryDto;

            const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

            expect(mockQueryBuilder.orderBy).not.toBeCalled();
            expect(queryBuilder).toEqual(mockQueryBuilder);
        });

        it('should not include orderBy in query if sort not exists', () => {
            const query = { field: 'name' } as PaginationQueryDto;

            const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

            expect(mockQueryBuilder.orderBy).not.toBeCalled();
            expect(queryBuilder).toEqual(mockQueryBuilder);
        });

        it('should include all queries', () => {
            const query = {
                search: 'some search',
                limit: '5',
                page: '0',
                field: 'name',
                sort: 'DESC',
            } as PaginationQueryDto;

            const queryBuilder = simplePaginateQuery(mockQueryBuilder as SelectQueryBuilder<any>, query);

            expect(mockQueryBuilder.take).toBeCalledWith(toNumber(query.limit));
            expect(mockQueryBuilder.skip).toBeCalledWith(toNumber(query.page) * toNumber(query.limit));
            expect(mockQueryBuilder.orderBy).toBeCalledWith(`"${query.field}"`, query.sort, 'NULLS LAST');
            expect(queryBuilder).toEqual(mockQueryBuilder);
        });
    });
});
