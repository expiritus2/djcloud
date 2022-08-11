import { AddTrackListenDto } from 'store/Stats/types';
import { apiServer } from 'settings/web-services/api';

export const addTrackListen = (cfg: AddTrackListenDto) => {
    return apiServer.post(`/stats/track/${cfg.trackId}/listen`);
};
