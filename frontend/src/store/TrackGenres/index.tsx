import { action, makeObservable, observable } from 'mobx';
import { RequestOptions } from 'types/request';
import { TrackGenre, TrackGenreParams } from './types';
import Api from 'store/core/Api';
import { getTracksGenres } from 'api/tracks';
import { BaseRequestStore } from 'store/core/BaseRequestStore';

export class TracksGenresStore extends BaseRequestStore<TrackGenre[]> {
    genres: { [key: string]: TrackGenre[] } = {};

    constructor(color: string) {
        super(color);

        makeObservable(this, {
            genres: observable,
            getTracksGenres: action,
        });
    }

    getTracksGenres(cfg: TrackGenreParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<TrackGenre[]>({ store: this, method: getTracksGenres }).execResult();

        sendRequest(cfg, options, (err: any, response: any) => {
            if (!err) {
                this.genres = { ...this.genres, [cfg.category.value]: response.data };
            }
            cb?.(err, response);
        });
    }
}
