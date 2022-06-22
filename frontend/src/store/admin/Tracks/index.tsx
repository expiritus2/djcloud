import { action, makeObservable } from 'mobx';
import { PaginatedItems, PaginationParams, RequestOptions } from 'types/request';
import { Track } from './types';
import Api from 'store/core/Api';
import { getAll } from 'api/admin/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class TracksStore extends BaseStore<PaginatedItems<Track>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Track>>({ store: this.store, method: getAll }).execResult();

        sendRequest({ limit: 15, ...this.store.meta, ...cfg }, options, cb);
    }
}
