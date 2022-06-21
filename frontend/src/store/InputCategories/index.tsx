import { action, makeObservable } from 'mobx';
import { PaginationParams, RequestOptions, PaginatedItems } from 'types/request';
import { Category } from './types';
import Api from 'store/core/Api';
import { getAll } from 'api/admin/categories';
import { BaseStore } from 'store/core/BaseStore';

export class InputCategoriesStore extends BaseStore<PaginatedItems<Category>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Category>>({ store: this.store, method: getAll }).execResult();

        sendRequest(cfg, options, cb);
    }
}
