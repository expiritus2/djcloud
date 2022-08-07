import { action, makeObservable } from 'mobx';
import { PaginatedItems, RequestOptions } from 'types/request';
import { GetAllByParams } from './types';
import { Track, TrackRating } from 'types/track';
import Api from 'store/core/Api';
import { getAll } from 'api/tracks';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { cloneDeep } from 'lodash';
import { adminPageTableLimit } from '../../settings';

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
                sort: 'DESC',
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
}
