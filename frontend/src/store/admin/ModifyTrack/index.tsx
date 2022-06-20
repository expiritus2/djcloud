import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { CreateTrackDto, GetTrackDto, RemoveTrackDto, UpdateTrackDto } from './types';
import { Track } from '../Tracks/types';
import Api from 'store/core/Api';
import { create, getById, update, remove } from 'api/admin/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class ModifyTrackStore extends BaseStore<Track> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            create: action,
            resetData: action,
        });
    }

    create(cfg?: CreateTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this.store, method: create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this.store, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this.store, method: update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this.store, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }

    resetData() {
        this.store = this.initStore;
    }
}
