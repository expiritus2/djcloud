import { getAll } from 'api/genres';
import { action, makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { PaginatedItems, PaginationParams, RequestOptions, SortEnum } from 'types/request';
import { Genre } from 'types/track';

import { adminPageTableLimit } from '../../settings';

export class GenresStore extends BaseRequestStore<PaginatedItems<Genre>> {
    constructor() {
        super();

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
