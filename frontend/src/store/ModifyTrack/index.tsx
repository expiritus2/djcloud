import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { CreateTrackDto, GetTrackDto, RemoveTrackDto, UpdateTrackDto, UpdateVisibleTrackDto } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { create, getById, update, remove } from 'api/tracks';
import { uploadFile } from 'api/files';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import store from 'store/index';

export class ModifyTrackStore extends BaseRequestStore<Track> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            create: action,
            remove: action,
            update: action,
            updateVisible: action,
            getById: action,
        });
    }

    create(cfg: CreateTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: create }).execResult();
        const uploadFileRequest = new Api({ store: this as any, method: uploadFile }).execResult();

        uploadFileRequest({ file: cfg.file, title: cfg.title }, { silent: false }, (err: any, response: any) => {
            if (!err) {
                const { duration, ...uploadedFile } = response.data;
                const config = {
                    ...cfg,
                    duration,
                    file: uploadedFile,
                };
                sendRequest(config, { silent: false, ...options }, cb);
            }
        });
    }

    remove(cfg?: RemoveTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg: UpdateTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: update }).execResult();
        const uploadFileRequest = new Api({ store: { data: {} } as any, method: uploadFile }).execResult();

        if (!cfg.file.id) {
            uploadFileRequest(cfg.file, { silent: false }, (err: any, response: any) => {
                if (!err) {
                    const { duration, ...uploadedFile } = response.data;
                    const config = {
                        ...cfg,
                        duration,
                        file: uploadedFile,
                    };
                    sendRequest(config, { silent: false, ...options }, cb);
                }
            });
        } else {
            sendRequest(cfg, { silent: false, ...options }, cb);
        }
    }

    updateVisible(cfg: UpdateVisibleTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: update }).execResult();

        sendRequest(cfg, options, (err: any, response: any) => {
            const tracksStoreData = store.tracks.data;
            if (!err && tracksStoreData) {
                const updatedTrackIndex = tracksStoreData.data.findIndex((track) => track.id === cfg.id);
                tracksStoreData.data[updatedTrackIndex].visible = response.data.visible;
            }

            if (cb) {
                cb(err, response);
            }
        });
    }

    getById(cfg: GetTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: this, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }
}
