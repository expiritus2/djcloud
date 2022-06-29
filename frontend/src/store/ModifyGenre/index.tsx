import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { CreateGenreDto, GetGenreDto, RemoveGenreDto, UpdateGenreDto } from './types';
import { Genre } from 'types/track';
import Api from 'store/core/Api';
import { create, getById, update, remove } from 'api/genres';
import { BaseStore } from 'store/core/BaseStore';

export class ModifyGenreStore extends BaseStore<Genre> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            create: action,
            remove: action,
            update: action,
            getById: action,
        });
    }

    create(cfg?: CreateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }
}
