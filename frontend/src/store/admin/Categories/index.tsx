import { action, makeObservable } from 'mobx';
import { PaginationParams, RequestOptions } from 'types/request';
import { Category } from './types';
import Api from 'store/core/Api';
import { getAll } from 'api/admin/categories';
import { BaseStore } from 'store/core/BaseStore';

export class CategoriesStore extends BaseStore<Category> {
    constructor() {
        super();

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ data: this.data, method: getAll }).execResult();

        sendRequest(cfg, options, cb);
    }
}
