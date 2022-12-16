import { cloneDeep } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';

export function getInitStore<T>(): StoreData<T> {
    return {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    };
}

export abstract class BaseRequestStore<T> {
    state: RequestStateEnum = cloneDeep(getInitStore().state);

    data: T | null = cloneDeep(getInitStore<T>().data);

    meta = cloneDeep(getInitStore().meta);

    protected constructor() {
        makeObservable(this, {
            state: observable,
            data: observable,
            meta: observable,
            resetStore: action,
        });
    }

    resetStore(state?: RequestStateEnum) {
        this.state = state ? state : cloneDeep(getInitStore().state);
        this.data = cloneDeep(getInitStore<T>().data);
        this.meta = cloneDeep(getInitStore().meta);
    }
}
