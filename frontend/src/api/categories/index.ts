import { apiServer } from 'settings/web-services/api';
import { CreateCategoryDto, GetCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from 'store/ModifyCategory/types';
import { PaginationParams } from 'types/request';

import { firebase } from '../../firebase';

export const getAll = (cfg: PaginationParams) => {
    return apiServer.get('/categories/list', { params: cfg });
};

export const create = async (cfg: CreateCategoryDto) => {
    // @ts-ignore
    const res = await firebase.db.collection('categories').doc(1).set(cfg);
    console.log('res', res);
    // return apiServer.post('/categories/create', cfg);
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
