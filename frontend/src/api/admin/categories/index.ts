import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/categories/list', { params: cfg });
};
