import { cloneDeep } from 'lodash';

export class StoreLogger {
    static logStore(storeName: string, propertyName: string, data: any) {
        console.log(storeName, propertyName, cloneDeep(data));
    }
}