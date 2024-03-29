import { apiServer } from 'settings/web-services/api';
import { AddTrackListenDto } from 'store/Stats/types';

export const addTrackListen = (cfg: AddTrackListenDto) => {
  return apiServer.post(`/stats/track/${cfg.trackId}/listen`);
};
