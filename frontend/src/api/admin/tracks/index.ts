import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/tracks/list', { params: cfg });
};
