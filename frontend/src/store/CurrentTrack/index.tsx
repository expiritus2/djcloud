import { action, makeObservable, observable, reaction } from 'mobx';
import { RequestOptions } from 'types/request';
import { GetTrackByIdParamsDto } from './types';
import { Track } from 'types/track';
import Api from 'store/core/Api';
import { getById } from 'api/tracks';
import { BaseStore } from 'store/core/BaseStore';

export class CurrentTrackStore extends BaseStore<Track> {
    pause: boolean = false;

    constructor(color: string) {
        super(color);

        reaction(
            () => this.pause,
            (pause) => {
                console.log('this');
                this.logStore('pause', pause);
            },
        );

        makeObservable(this, {
            pause: observable,
            getTrackById: action,
            setPause: action,
            setPlay: action,
        });
    }

    getTrackById(cfg?: GetTrackByIdParamsDto, options?: RequestOptions, cb?: Function) {
        this.resetStore();
        const sendRequest = new Api<Track>({ store: this, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }

    resetStore() {
        super.resetStore();
        this.pause = false;
    }

    setPause() {
        this.pause = true;
    }

    setPlay() {
        this.pause = false;
    }
}
