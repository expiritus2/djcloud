import { action, makeObservable } from 'mobx';
import { PaginatedItems, PaginationParams, RequestOptions } from 'types/request';
import { Genre } from './types';
import Api from 'store/core/Api';
import { getAll } from 'api/admin/genres';
import { BaseStore } from 'store/core/BaseStore';

export class GenresStore extends BaseStore<PaginatedItems<Genre>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Genre>>({ store: this.store, method: getAll }).execResult();

        sendRequest(cfg, options, cb);
    }
}
