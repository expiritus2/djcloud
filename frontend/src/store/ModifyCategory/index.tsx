import { create, getById, remove, update } from 'api/categories';
import { action, makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { RequestOptions } from 'types/request';
import { Category } from 'types/track';

import { CreateCategoryDto, GetCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from './types';

export class ModifyCategoryStore extends BaseRequestStore<Category> {
    constructor() {
        super();

        makeObservable(this, {
            create: action,
        });
    }

    create(cfg?: CreateCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this, method: create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this, method: update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }
}
