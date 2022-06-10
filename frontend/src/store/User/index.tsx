import { action, makeAutoObservable, observable, observe, reaction } from 'mobx';
import { RequestOptions, RequestStateEnum } from '../../types/request';
import { LoginProps, User } from './types';
import { StoreData } from '../../types/store';
import Api from '../core/Api';
import { login } from '../../api/user';
import { StoreLogger } from '../core/Logger';

export class UserStore {
    @observable
    data: StoreData<User> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    }

    constructor() {
        makeAutoObservable(this);

        StoreLogger.logStore(this.constructor.name, 'state', this.data)
        reaction(() => this.data.state, (flag) => StoreLogger.logStore(this.constructor.name, 'state', flag))
        reaction(() => this.data.data, (flag) => StoreLogger.logStore(this.constructor.name, 'data', flag))
        reaction(() => this.data.meta, (flag) => StoreLogger.logStore(this.constructor.name, 'meta', flag));

        observe(this.data, () => {});
    }

    @action
    loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ data: this.data, method: login }).execResult();

        sendRequest(cfg, options, cb);
    }

    @action
    logoutAction() {
        this.data.data = null;
    }
}