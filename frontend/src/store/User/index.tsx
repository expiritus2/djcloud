import { action, makeObservable } from 'mobx';
import { RequestOptions } from '../../types/request';
import { LoginProps, User } from './types';
import Api from '../core/Api';
import { currentUser, login } from '../../api/user';
import { BaseRequestStore } from '../core/BaseRequestStore';

export class UsersStore extends BaseRequestStore<User> {
    constructor(color: string) {
        super(color);

        makeObservable(this, {
            loginAction: action,
            logoutAction: action,
            currentUser: action,
        });
    }

    loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ store: this, method: login }).execResult();

        sendRequest(cfg, options, cb);
    }

    logoutAction() {
        this.resetStore();
    }

    currentUser(cfg?: {}, options?: RequestOptions, cb?: Function) {
        const sendRequest = new Api<User>({ store: this, method: currentUser }).execResult();

        sendRequest(cfg, { silent: false, ...options }, cb);
    }
}
