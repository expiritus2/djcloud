import { action, makeObservable } from 'mobx';
import { RequestOptions } from 'types/request';
import { CreateCategoryDto, GetCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from './types';
import { Category } from '../Categories/types';
import Api from 'store/core/Api';
import { create, getById, update, remove } from 'api/admin/categories';
import { BaseStore } from 'store/core/BaseStore';

export class ModifyCategoryStore extends BaseStore<Category> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            create: action,
            resetData: action,
        });
    }

    create(cfg?: CreateCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this.store, method: create }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    remove(cfg?: RemoveCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this.store, method: remove }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    update(cfg?: UpdateCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this.store, method: update }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }

    getById(cfg: GetCategoryDto, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<Category>({ store: this.store, method: getById }).execResult();

        sendRequest(cfg, options, cb);
    }

    resetData() {
        this.store = this.initStore;
    }
}
