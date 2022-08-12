import { makeObservable } from 'mobx';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';
import Api from 'store/core/Api';
import { Track } from 'types/track';
import { addTrackListen } from 'api/stats';
import { AddTrackListenDto } from './types';

export class Stats extends BaseRequestStore<any> {
    constructor(color?: string) {
        super(color);

        makeObservable(this, {});
    }

    addTrackListenAction(cfg: AddTrackListenDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: addTrackListen }).execResult();

        sendRequest(cfg, options, cb);
    }
}
