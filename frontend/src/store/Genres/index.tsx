import { action, makeObservable } from 'mobx';
import { PaginatedItems, PaginationParams, RequestOptions, SortEnum } from 'types/request';
import { Genre } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/genres';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { adminPageTableLimit } from '../../settings';

export class GenresStore extends BaseRequestStore<PaginatedItems<Genre>> {
    constructor(color?: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Genre>>({ store: this, method: getAll }).execResult();

        sendRequest(
            { limit: adminPageTableLimit, field: 'id', sort: SortEnum.DESC, ...this.meta, ...cfg },
            options,
            cb,
        );
    }
}
