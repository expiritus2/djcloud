import { getTracksGenres } from 'api/tracks';
import { action, makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';

import { TrackGenre, TrackGenreParams } from './types';

export type GroupedTrackGenres = {
    [key: number]: TrackGenre[];
};

export class TracksGenresStore extends BaseRequestStore<GroupedTrackGenres> {
    constructor() {
        super();

        makeObservable(this, {
            getTracksGenres: action,
        });
    }

    getTracksGenres(cfg?: TrackGenreParams, options?: RequestOptions, cb?: Function): void {
        const sendRequest = new Api<GroupedTrackGenres>({
            store: this,
            method: getTracksGenres,
        }).execResult();

        const config = { visible: true, ...cfg };

        sendRequest(config, options, cb);
    }
}
