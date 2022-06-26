/* eslint-disable prettier/prettier */
import { makeObservable, observable, reaction } from 'mobx';
import { RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';
import { cloneDeep } from 'lodash';

export abstract class BaseStore<T> {
    color: string;

    readonly initStore: StoreData<T> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    };

    store: StoreData<T> = cloneDeep(this.initStore);

    protected constructor(color: string) {
        this.color = color;

        makeObservable(this, {
            store: observable,
        });

        // this.logStore('state', this.store);

        reaction(
            () => this.store.state,
            (state) => this.logStore('state', state),
        );
        reaction(
            () => this.store.data,
            (data) => this.logStore('data', data),
        );
        reaction(
            () => this.store.meta,
            (meta) => this.logStore('meta', meta),
        );
    }

    logStore(propertyName: string, data: any) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`%c ${this.constructor.name}`, `color: ${this.color}`, propertyName, cloneDeep(data));
        }
    }

    resetStore() {
        this.store = this.initStore;
    }
}
