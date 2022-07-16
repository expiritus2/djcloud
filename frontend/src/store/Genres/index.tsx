import { action, makeObservable } from 'mobx';
import { PaginatedItems, PaginationParams, RequestOptions } from 'types/request';
import { Genre } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/genres';
import { BaseRequestStore } from 'store/core/BaseRequestStore';

export class GenresStore extends BaseRequestStore<PaginatedItems<Genre>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Genre>>({ store: this, method: getAll }).execResult();

        sendRequest({ limit: 12, ...this.meta, ...cfg }, options, cb);
    }
}
