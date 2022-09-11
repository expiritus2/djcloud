import { getById } from 'api/tracks';
import { action, makeObservable, observable, reaction } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';
import { Track } from 'types/track';

import { adminPageTableLimit, mainPageTrackLimit } from '../../settings';
import { TrackRating } from '../TrackRating/types';

import { GetTrackByIdParamsDto } from './types';
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
    setDocumentTitle,
} from './utils';

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

        reaction(
            () => this.data,
            (data) => {
                if (!data?.title) {
                    setDocumentTitle();
                }
            },
        );
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

        sendRequest(cfg, options, (err: any, response: any) => {
            const { data } = response;
            setDocumentTitle(data.title);
            cb?.(err, response);
        });
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
        setDocumentTitle(this.data?.title);
    }

    setPrevTrack(currentEndTrackIndex: number, tracks: Track[]) {
        this.data = tracks[currentEndTrackIndex - 1];
        this.setPlay();
        setDocumentTitle(this.data?.title);
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
