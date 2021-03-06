import { action, makeObservable } from 'mobx';
import { PaginationParams, RequestOptions, PaginatedItems } from 'types/request';
import { Category } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/categories';
import { BaseRequestStore } from 'store/core/BaseRequestStore';

export class CategoriesStore extends BaseRequestStore<PaginatedItems<Category>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Category>>({ store: this, method: getAll }).execResult();

        sendRequest({ limit: 12, ...this.meta, ...cfg }, options, cb);
    }
}
