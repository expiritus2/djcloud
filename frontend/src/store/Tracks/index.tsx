import { action, makeObservable } from 'mobx';
import { PaginatedItems, RequestOptions, SortEnum } from 'types/request';
import { GetAllByParams, SendToTelegramDto } from './types';
import { Track, TrackRating } from 'types/track';
import Api from 'store/core/Api';
import { getAll, sendToTelegram } from 'api/tracks';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { cloneDeep } from 'lodash';
import { adminPageTableLimit } from 'settings';
import { GetTrackDto } from '../ModifyTrack/types';
import { getById } from 'api/tracks';

export class TracksStore extends BaseRequestStore<PaginatedItems<Track>> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            getAll: action,
            setTrackRating: action,
        });
    }

    getAll(cfg?: GetAllByParams, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<PaginatedItems<Track>>({ store: this, method: getAll }).execResult();

        sendRequest(
            {
                limit: adminPageTableLimit,
                field: 'createdAt',
                sort: SortEnum.DESC,
                ...this.meta,
                ...cfg,
            },
            { silent: false, ...options },
            cb,
        );
    }

    setTrackRating(trackRating: TrackRating, trackId: number) {
        const clonedData = cloneDeep(this.data);
        const updateTrack = clonedData?.data.find((track) => track.id === trackId);

        if (updateTrack) {
            updateTrack.rating = trackRating.rating;
            updateTrack.countRatings = trackRating.countRatings;
            updateTrack.isDidRating = trackRating.isDidRating;
        }

        this.data = clonedData;
    }

    getById(cfg: GetTrackDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: { data: {} } as any, method: getById }).execResult();

        sendRequest(cfg, options, (err: any, response: any) => {
            if (!err) {
                this.data = {
                    data: [response.data],
                    count: 1,
                };
            }
            cb?.(err, response);
        });
    }

    sendToTelegram(cfg: SendToTelegramDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Track>({ store: { data: {} } as any, method: sendToTelegram }).execResult();

        sendRequest(cfg, options, cb);
    }
}
