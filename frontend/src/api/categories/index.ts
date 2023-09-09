import { apiServer } from 'settings/web-services/api';
import { CreateCategoryDto, GetCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from 'store/ModifyCategory/types';
import { PaginationParams } from 'types/request';

import { firebase } from '../../firebase';

const COLLECTION_NAME = 'categories';

export const getAll = async (cfg: PaginationParams) => {
    const docs = await firebase.getDocuments(COLLECTION_NAME, cfg);
    return { data: { data: docs } };
    // return apiServer.get('/categories/list', { params: cfg });
};

export const create = async (cfg: CreateCategoryDto): Promise<string> => {
    const result = await firebase.addDocument(COLLECTION_NAME, { name: cfg.name, value: cfg.name.toLowerCase() });
    return result.id;
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
