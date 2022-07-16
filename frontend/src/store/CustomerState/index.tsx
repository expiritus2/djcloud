import { action, makeObservable, observable } from 'mobx';

export class CustomerState {
    tab: { [key: string]: string | null } = {};

    constructor() {
        makeObservable(this, {
            tab: observable,
            setTab: action,
        });
    }

    setTab(tabValue: string, category: string) {
        this.tab = { ...this.tab, [category]: tabValue };
    }
}
