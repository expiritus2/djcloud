import { action, makeObservable, observable, reaction } from 'mobx';
import { RequestOptions } from 'types/request';
import { GetTrackByIdParamsDto } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { getById } from 'api/tracks';
import { BaseStore } from 'store/core/BaseStore';
import {
    getActualTrackIndex,
    getCurrentPageTracks,
    getCurrentTrackIndex,
    getTracksNextPage,
    isNotLastTrack,
    isNotLastTrackOnLastPage,
    isVeryLastTrack,
    requestNextPageTracks,
} from './utils';
import store from '../index';

export class CurrentTrackStore extends BaseStore<Track> {
    pause: boolean = false;

    initialPlayedTrackPage: number = 0;

    constructor(color: string) {
        super(color);

        reaction(
            () => this.pause,
            (pause) => {
                this.logStore('pause', pause);
            },
        );

        makeObservable(this, {
            pause: observable,
            initialPlayedTrackPage: observable,
            getTrackById: action,
            setPause: action,
            setPlay: action,
            onEnd: action,
        });
    }

    getTrackById(cfg?: GetTrackByIdParamsDto, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<Track>({ store: this, method: getById }).execResult();
        this.initialPlayedTrackPage = store.tracks.meta.page;

        sendRequest(cfg, options, cb);
    }

    resetStore() {
        super.resetStore();
        this.pause = false;
    }

    setPause(isPause: boolean) {
        this.pause = isPause;
    }

    setPlay() {
        this.setPause(false);
    }

    setNextTrack(currentEndTrackIndex: number, tracks: Track[]) {
        this.data = tracks[currentEndTrackIndex + 1];
        this.setPlay();
    }

    onEnd() {
        const tracks = getCurrentPageTracks();

        if (tracks.length) {
            const currentTrackIndex = getCurrentTrackIndex();

            if (isNotLastTrack(currentTrackIndex, tracks)) {
                this.setNextTrack(currentTrackIndex, tracks);
            }

            if (isVeryLastTrack(currentTrackIndex, tracks)) {
                const actualTrackIndex = getActualTrackIndex();

                if (isNotLastTrackOnLastPage(actualTrackIndex)) {
                    const nextPage = getTracksNextPage();

                    requestNextPageTracks(nextPage, (err: any, response: any) => {
                        const nextPageTracks = response.data.data || [];

                        if (!err && nextPageTracks.length) {
                            this.setNextTrack(-1, nextPageTracks);
                        }
                    });
                }
            }
        }
    }
}
