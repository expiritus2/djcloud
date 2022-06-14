import { apiServer } from 'settings/web-services/api';
import { PaginationParams } from 'types/request';
import {
    CreateCategoryDto,
    GetCategoryDto,
    RemoveCategoryDto,
    UpdateCategoryDto,
} from 'store/admin/ModifyCategory/types';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/categories/list', { params: cfg });
};

export const create = (cfg: CreateCategoryDto) => {
    return apiServer.post('/categories/create', cfg);
};

export const update = (cfg: UpdateCategoryDto) => {
    const { id, ...config } = cfg;
    return apiServer.patch(`/categories/${id}`, config);
};

export const remove = (cfg: RemoveCategoryDto) => {
    return apiServer.delete(`/categories/${cfg.id}`);
};

export const getById = (cfg: GetCategoryDto) => {
    return apiServer.get(`/categories/${cfg.id}`);
};
