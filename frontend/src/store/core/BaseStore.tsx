import { makeObservable, observable, reaction } from 'mobx';
import { RequestStateEnum } from '../../types/request';
import { StoreData } from '../../types/store';
import { StoreLogger } from './Logger';

export abstract class BaseStore<T> {
    data: StoreData<T> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    }

    protected constructor() {
        makeObservable(this, {
            data: observable,
        });

        StoreLogger.logStore(this.constructor.name, 'state', this.data)
        reaction(() => this.data.state, (flag) => StoreLogger.logStore(this.constructor.name, 'state', flag))
        reaction(() => this.data.data, (flag) => StoreLogger.logStore(this.constructor.name, 'data', flag))
        reaction(() => this.data.meta, (flag) => StoreLogger.logStore(this.constructor.name, 'meta', flag));
    }
}