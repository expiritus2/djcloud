import { getAll, sendToTelegram } from 'api/tracks';
import { getById } from 'api/tracks';
import { cloneDeep } from 'lodash';
import { action, makeObservable } from 'mobx';
import { adminPageTableLimit } from 'settings';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { PaginatedItems, RequestOptions, SortEnum } from 'types/request';
import { Track, TrackRating, TrackStats } from 'types/track';

import { GetTrackDto } from '../ModifyTrack/types';

import { GetAllByParams, SendToTelegramDto } from './types';

export class TracksStore extends BaseRequestStore<PaginatedItems<Track> & TrackStats> {
  constructor() {
    super();

    makeObservable(this, {
      getAll: action,
      setTrackRating: action,
    });
  }

  getAll(cfg?: GetAllByParams, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<PaginatedItems<Track>>({
      store: this,
      method: getAll,
    }).execResult();

    const request = {
      limit: adminPageTableLimit,
      field: 'createdAt',
      sort: SortEnum.DESC,
      withStats: true,
      ...this.meta,
      ...cfg,
    };

    sendRequest(request, { silent: false, ...options }, cb);
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
    const sendRequest = new Api<Track>({
      store: { data: {} } as any,
      method: getById,
    }).execResult();

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
    const sendRequest = new Api<Track>({
      store: { data: {} } as any,
      method: sendToTelegram,
    }).execResult();

    sendRequest(cfg, options, cb);
  }

  setMeta(meta: typeof this.meta) {
    this.meta = { ...this.meta, ...meta };
  }
}
