import { getAll } from 'api/categories';
import { action, makeObservable, reaction } from 'mobx';
import { adminPageTableLimit } from 'settings';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { PaginatedItems, PaginationParams, RequestOptions, SortEnum } from 'types/request';
import { Category } from 'types/track';

import store from '..';

export class CategoriesStore extends BaseRequestStore<PaginatedItems<Category>> {
  constructor() {
    super();

    makeObservable(this, {
      getAll: action,
    });

    reaction(
      () => this.data,
      (data) => store.navCategories.setData(data as PaginatedItems<Category>)
    );
  }

  getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<PaginatedItems<Category>>({
      store: this,
      method: getAll,
    }).execResult();

    sendRequest(
      { limit: adminPageTableLimit, field: 'id', sort: SortEnum.DESC, ...this.meta, ...cfg },
      options,
      cb
    );
  }
}
