import { action, makeObservable, observable } from 'mobx';
import { RequestOptions } from 'types/request';
import { GetTrackByIdParamsDto } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { getById } from 'api/tracks';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import {
    getActualTrackIndex,
    getCurrentPageTracks,
    getCurrentTrackIndex,
    getTracksNextPage,
    getTracksPrevPage,
    isNotFirstTrack,
    isNotFirstTrackOnFirstPage,
    isNotLastTrack,
    isNotLastTrackOnLastPage,
    isVeryFirstTrack,
    isVeryLastTrack,
    requestPageTracks,
} from './utils';
import { adminPageTableLimit, mainPageTrackLimit } from '../../settings';
import { TrackRating } from '../TrackRating/types';

export class CurrentTrackStore extends BaseRequestStore<Track> {
    pause: boolean = false;

    constructor(color?: string) {
        super(color);

        makeObservable(this, {
            pause: observable,
            getTrackById: action,
            setPause: action,
            setPlay: action,
            onNext: action,
            updateRating: action,
        });
    }

    logStore() {
        super.logStore();
        this.logMessage<'pause'>('pause');
    }

    updateRating(trackRating: TrackRating | null) {
        if (trackRating && this.data?.id === trackRating?.trackId) {
            this.data.rating = trackRating.rating;
            this.data.countRatings = trackRating.countRatings;
            this.data.isDidRating = trackRating.isDidRating;
        }
    }

    getTrackById(cfg: GetTrackByIdParamsDto, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<Track>({ store: this, method: getById }).execResult();

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

    setPrevTrack(currentEndTrackIndex: number, tracks: Track[]) {
        this.data = tracks[currentEndTrackIndex - 1];
        this.setPlay();
    }

    onNext(isAdmin = false) {
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

                    requestPageTracks(nextPage, isAdmin, (err: any, response: any) => {
                        const nextPageTracks = response.data.data || [];

                        if (!err && nextPageTracks.length) {
                            this.setNextTrack(-1, nextPageTracks);
                        }
                    });
                }
            }
        }
    }

    onPrev(isAdmin = false) {
        const tracks = getCurrentPageTracks();

        if (tracks.length) {
            const currentTrackIndex = getCurrentTrackIndex();

            if (isNotFirstTrack(currentTrackIndex)) {
                this.setPrevTrack(currentTrackIndex, tracks);
            }

            if (isVeryFirstTrack(currentTrackIndex)) {
                const actualTrackIndex = getActualTrackIndex();

                if (isNotFirstTrackOnFirstPage(actualTrackIndex)) {
                    const prevPage = getTracksPrevPage();

                    requestPageTracks(prevPage, isAdmin, (err: any, response: any) => {
                        const prevPageTracks = response.data.data || [];

                        if (!err && prevPageTracks.length) {
                            this.setPrevTrack(isAdmin ? adminPageTableLimit : mainPageTrackLimit, prevPageTracks);
                        }
                    });
                }
            }
        }
    }
}
