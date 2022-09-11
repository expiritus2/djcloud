import { makeObservable, observable } from 'mobx';

import { AdminTabsEnum } from './types';

export class AdminState {
    tab: { [key: string]: AdminTabsEnum | null } = {};

    constructor() {
        makeObservable(this, {
            tab: observable,
        });
    }
}
