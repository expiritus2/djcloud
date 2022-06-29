import { action, makeObservable } from 'mobx';
import { PaginatedItems, RequestOptions } from 'types/request';
import { GetAllByParams } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class TracksStore extends BaseStore<PaginatedItems<Track>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: GetAllByParams, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<PaginatedItems<Track>>({ store: this, method: getAll }).execResult();

        sendRequest({ limit: 15, ...this.meta, ...cfg }, options, cb);
    }
}
