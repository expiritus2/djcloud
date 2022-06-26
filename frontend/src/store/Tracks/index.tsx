import { action, makeObservable } from 'mobx';
import { PaginatedItems, RequestOptions } from 'types/request';
import { GetAllByParams, Track, TrackGenre, TrackGenreParams } from './types';
import Api from 'store/core/Api';
import { getAll, getTracksGenres } from 'api/admin/tracks';
import { BaseStore } from 'store/core/BaseStore';
import { StoreData } from '../../types/store';

export class TracksStore extends BaseStore<PaginatedItems<Track>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
        });
    }

    getAll(cfg?: GetAllByParams, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<PaginatedItems<Track>>({ store: this.store, method: getAll }).execResult();

        sendRequest({ limit: 15, ...this.store.meta, ...cfg }, options, cb);
    }

    getTracksGenres(cfg: TrackGenreParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<TrackGenre>({
            store: {} as StoreData<TrackGenre>,
            method: getTracksGenres,
        }).execResult();

        sendRequest(cfg, options, cb);
    }
}
