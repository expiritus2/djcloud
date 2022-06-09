import { action, makeAutoObservable, observable } from 'mobx';
import { RequestOptions, RequestStateEnum } from '../../types/request';
import { LoginProps, User } from './types';
import { StoreData } from '../../types/store';
import Api from '../core/Api';
import { login } from '../../api/user';

export class UserStore {
    @observable
    data: StoreData<User> = {
        state: RequestStateEnum.IDLE,
        data: null,
        meta: {},
    }

    constructor() {
        makeAutoObservable(this)
    }

    @action loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ data: this.data, method: login }).execResult();

        sendRequest(cfg, options, cb);
    }

    @action
    logoutAction() {
        this.data.data = null;
    }
}