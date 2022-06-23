import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';
import { CreateTrackDto, GetTrackDto, RemoveTrackDto, UpdateTrackDto } from 'store/admin/ModifyTrack/types';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/tracks/list', { params: cfg });
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

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiServer.post('/tracks/file-upload', formData);
};
