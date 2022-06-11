/* eslint-disable prettier/prettier */
import { makeObservable, observable, reaction } from 'mobx';
import { RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';
import { cloneDeep } from 'lodash';

export abstract class BaseStore<T> {
    data: StoreData<T> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    };

    protected constructor() {
        makeObservable(this, {
            data: observable,
        });

        this.logStore('state', this.data);

        reaction(() => this.data.state, (state) => this.logStore('state', state));
        reaction(() => this.data.data, (data) => this.logStore('data', data));
        reaction(() => this.data.meta, (meta) => this.logStore('meta', meta));
    }

    logStore(propertyName: string, data: any) {
        if (process.env.NODE_ENV === 'development') {
            console.log(this.constructor.name, propertyName, cloneDeep(data));
        }
    }
}
