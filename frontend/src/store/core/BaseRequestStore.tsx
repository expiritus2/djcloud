/* eslint-disable prettier/prettier */
import { cloneDeep } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { toJS } from 'mobx';
import { RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';

export abstract class BaseRequestStore<T> {
    color: string = '';

    readonly initStore: StoreData<T> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    };

    state: RequestStateEnum = cloneDeep(this.initStore.state);

    data: T | null = cloneDeep(this.initStore.data);

    meta = cloneDeep(this.initStore.meta);

    protected constructor(color?: string) {
        if (color) {
            this.color = color;
        }

        makeObservable(this, {
            state: observable,
            data: observable,
            meta: observable,
            resetStore: action,
        });
    }

    logMessage<P>(propName: 'state' | 'data' | 'meta' | P) {
        if (process.env.NODE_ENV === 'development') {
            // @ts-ignore
            console.log(`%c ${this.constructor.name}`, `color: ${this.color}`, propName, toJS(this[propName]));
        }
    }

    logStore() {
        this.logMessage('state');
        this.logMessage('data');
        this.logMessage('meta');
    }

    resetStore(state?: RequestStateEnum) {
        this.state = state ? state : cloneDeep(this.initStore.state);
        this.data = cloneDeep(this.initStore.data);
        this.meta = cloneDeep(this.initStore.meta);
    }
}
