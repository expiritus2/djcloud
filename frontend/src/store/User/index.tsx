import { action, makeObservable } from 'mobx';
import { RequestOptions } from '../../types/request';
import { LoginProps, User } from './types';
import Api from '../core/Api';
import { currentUser, login } from '../../api/user';
import { BaseStore } from '../core/BaseStore';

export class UserStore extends BaseStore<User> {
    constructor() {
        super();

        makeObservable(this, {
            loginAction: action,
            logoutAction: action,
            currentUser: action,
        });
    }

    loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ data: this.data, method: login }).execResult();

        sendRequest(cfg, options, cb);
    }

    logoutAction() {
        this.data.data = null;
    }

    currentUser(cfg?: {}, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ data: this.data, method: currentUser }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }
}