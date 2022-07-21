import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';
import { CreateTrackDto, GetTrackDto, RemoveTrackDto, UpdateTrackDto } from 'store/ModifyTrack/types';
import { TrackGenreParams } from 'store/Tracks/types';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/tracks/list', { params: cfg });
};

export const getTracksGenres = (cfg: TrackGenreParams) => {
    return apiServer.get('/tracks/tracks-genres', { params: { visible: cfg.visible } });
};

export const create = (cfg: CreateTrackDto) => {
    return apiServer.post('/tracks/create', cfg);
};

export const update = (cfg: UpdateTrackDto) => {
    const { id, ...config } = cfg;
    return apiServer.patch(`/tracks/${id}`, config);
};

export const remove = (cfg: RemoveTrackDto) => {
    return apiServer.delete(`/tracks/${cfg.id}`);
};

export const getById = (cfg: GetTrackDto) => {
    return apiServer.get(`/tracks/${cfg.id}`);
};
