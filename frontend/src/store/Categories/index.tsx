import { action, makeObservable, reaction } from 'mobx';
import { PaginationParams, RequestOptions, PaginatedItems } from 'types/request';
import { Category } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/categories';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import store from '..';
import { adminPageTableLimit } from 'settings';

export class CategoriesStore extends BaseRequestStore<PaginatedItems<Category>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });

        reaction(
            () => this.data,
            (data) => store.navCategories.setData(data as PaginatedItems<Category>),
        );
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Category>>({ store: this, method: getAll }).execResult();

        sendRequest({ limit: adminPageTableLimit, ...this.meta, ...cfg }, options, cb);
    }
}
