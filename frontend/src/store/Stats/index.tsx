import { addTrackListen } from 'api/stats';
import { makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';
import { Track } from 'types/track';

import { AddTrackListenDto } from './types';

export class Stats extends BaseRequestStore<any> {
  constructor() {
    super();

    makeObservable(this, {});
  }

  addTrackListenAction(cfg: AddTrackListenDto, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<Track>({ store: this, method: addTrackListen }).execResult();

    sendRequest(cfg, options, cb);
  }
}
