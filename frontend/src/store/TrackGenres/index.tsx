import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { TrackGenre, TrackGenreParams } from './types';
import Api from 'store/core/Api';
import { getTracksGenres } from 'api/tracks';
import { BaseRequestStore } from 'store/core/BaseRequestStore';

export type GroupedTrackGenres = {
    [key: number]: TrackGenre[];
};

export type NestedTrackGenres = {
    [key: string]: {
        [key: string]: TrackGenre[];
    };
};

export class TracksGenresStore extends BaseRequestStore<GroupedTrackGenres | NestedTrackGenres> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getTracksGenres: action,
        });
    }

    getTracksGenres(cfg?: TrackGenreParams, options?: RequestOptions, cb?: Function): void {
        const sendRequest = new Api<GroupedTrackGenres | NestedTrackGenres>({
            store: this,
            method: getTracksGenres,
        }).execResult();

        const config = { visible: true, ...cfg };

        sendRequest(config, options, cb);
    }
}
