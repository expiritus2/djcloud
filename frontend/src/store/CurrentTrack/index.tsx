import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { GetTrackByIdParamsDto } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { getById } from 'api/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class CurrentTrackStore extends BaseStore<Track> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getTrackById: action,
        });
    }

    getTrackById(cfg?: GetTrackByIdParamsDto, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<Track>({ store: this.store, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }
}
