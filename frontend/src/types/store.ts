import { RequestStateEnum } from './request';

export type StoreData<T> = {
    state: RequestStateEnum;
    data: T | null;
    meta: any;
};
