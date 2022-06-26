import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { CreateGenreDto, GetGenreDto, RemoveGenreDto, UpdateGenreDto } from './types';
import { Genre } from '../Genres/types';
import Api from 'store/core/Api';
import { create, getById, update, remove } from 'api/admin/genres';
import { BaseStore } from 'store/core/BaseStore';

export class ModifyGenreStore extends BaseStore<Genre> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            create: action,
            resetData: action,
        });
    }

    create(cfg?: CreateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this.store, method: create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this.store, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this.store, method: update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetGenreDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Genre>({ store: this.store, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }

    resetData() {
        this.store = this.initStore;
    }
}
