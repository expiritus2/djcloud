import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';
import { CreateGenreDto, GetGenreDto, RemoveGenreDto, UpdateGenreDto } from 'store/ModifyGenre/types';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/genres/list', { params: cfg });
};

export const create = (cfg: CreateGenreDto) => {
    return apiServer.post('/genres/create', cfg);
};

export const update = (cfg: UpdateGenreDto) => {
    const { id, ...config } = cfg;
    return apiServer.patch(`/genres/${id}`, config);
};

export const remove = (cfg: RemoveGenreDto) => {
    return apiServer.delete(`/genres/${cfg.id}`);
};

export const getById = (cfg: GetGenreDto) => {
    return apiServer.get(`/genres/${cfg.id}`);
};
