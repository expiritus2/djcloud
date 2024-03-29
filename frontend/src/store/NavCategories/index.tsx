import { getAll } from 'api/categories';
import { cloneDeep } from 'lodash';
import { action, makeObservable } from 'mobx';
import Api from 'store/core/Api';
import { BaseRequestStore } from 'store/core/BaseRequestStore';
import { PaginatedItems, PaginationParams, RequestOptions, SortEnum } from 'types/request';
import { Category } from 'types/track';

export class NavCategoriesStore extends BaseRequestStore<PaginatedItems<Category>> {
  constructor() {
    super();

    makeObservable(this, {
      getAll: action,
    });
  }

  getAll(cfg?: PaginationParams, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<PaginatedItems<Category>>({
      store: this,
      method: getAll,
    }).execResult();

    sendRequest(
      { limit: 5, field: 'name', sort: SortEnum.DESC, ...this.meta, ...cfg },
      options,
      cb
    );
  }

  setData(categories: PaginatedItems<Category>) {
    const clonedCategories = cloneDeep(categories);
    clonedCategories.data.sort((a, b) => b.name.localeCompare(a.name));
    this.data = clonedCategories;
  }
}
