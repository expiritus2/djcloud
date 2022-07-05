/* eslint-disable prettier/prettier */
import { action, makeObservable, observable, reaction } from 'mobx';
import { RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';
import { cloneDeep } from 'lodash';
import { logStore } from '../../settings';

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
        if(color) {
            this.color = color;
        }

        makeObservable(this, {
            state: observable,
            data: observable,
            meta: observable,
            resetStore: action,
        });

        reaction(
            () => this.state,
            (state) => this.logStore('state', state),
        );
        reaction(
            () => this.data,
            (data) => this.logStore('data', data),
        );
        reaction(
            () => this.meta,
            (meta) => this.logStore('meta', meta),
        );
    }

    logStore(propertyName: string, data: any) {
        if (process.env.NODE_ENV === 'development' && logStore) {
            console.log(`%c ${this.constructor.name}`, `color: ${this.color}`, propertyName, cloneDeep(data));
        }
    }

    resetStore() {
        this.state = cloneDeep(this.initStore.state);
        this.data = cloneDeep(this.initStore.data);
        this.meta = cloneDeep(this.initStore.meta);
    }
}
