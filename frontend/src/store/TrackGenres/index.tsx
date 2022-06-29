import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { TrackGenre, TrackGenreParams } from './types';
import Api from 'store/core/Api';
import { getTracksGenres } from 'api/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class TracksGenresStore extends BaseStore<TrackGenre[]> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getTracksGenres: action,
        });
    }

    getTracksGenres(cfg: TrackGenreParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<TrackGenre[]>({ store: this, method: getTracksGenres }).execResult();

        sendRequest(cfg, options, cb);
    }
}
