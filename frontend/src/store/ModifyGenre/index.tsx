import { Genres } from 'api/genres';
import { action, makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';
import { Genre } from 'types/track';

import { CreateGenreDto, GetGenreDto, RemoveGenreDto, UpdateGenreDto } from './types';

export class ModifyGenreStore extends BaseRequestStore<Genre> {
    constructor() {
        super();

        makeObservable(this, {
            create: action,
            remove: action,
            update: action,
            getById: action,
        });
    }

    create(cfg?: CreateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: Genres.create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: Genres.remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: Genres.update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: Genres.getById }).execResult();

        sendRequest(cfg, options, cb);
    }
}
