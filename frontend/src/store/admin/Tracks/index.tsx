import { action, makeObservable } from 'mobx';
import { PaginationParams, RequestOptions } from 'types/request';
import { Track } from './types';
import Api from 'store/core/Api';
import { getAll } from 'api/admin/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class TracksStore extends BaseStore<Track> {
    constructor() {
        super();

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ data: this.data, method: getAll }).execResult();

        sendRequest(cfg, options, cb);
    }
}
