import { action, makeObservable, reaction } from 'mobx';
import { AddTrackRatingDto, GetTrackRatingDto, TrackRating } from './types';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import Api from 'store/core/Api';
import { addRating, getRating } from 'api/trackRating';
import { RequestOptions } from 'types/request';
import store from 'store';

export class TrackRatingStore extends BaseRequestStore<TrackRating> {
    constructor(color?: string) {
        super(color);

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
