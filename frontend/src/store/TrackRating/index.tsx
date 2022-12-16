import { addRating, getRating } from 'api/trackRating';
import { action, makeObservable, reaction } from 'mobx';
import store from 'store';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';

import { AddTrackRatingDto, GetTrackRatingDto, TrackRating } from './types';

export class TrackRatingStore extends BaseRequestStore<TrackRating> {
    constructor() {
        super();

        makeObservable(this, {
            addTrackRating: action,
            getRating: action,
        });

        reaction(
            () => this.data,
            (data) => {
                store.currentTrack.updateRating(data);
            },
        );
    }

    addTrackRating(cfg: AddTrackRatingDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<TrackRating>({ store: this, method: addRating }).execResult();

        sendRequest(cfg, options, cb);
    }

    getRating(cfg: GetTrackRatingDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<TrackRating>({ store: this, method: getRating }).execResult();

        sendRequest(cfg, options, cb);
    }
}
