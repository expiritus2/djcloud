import { currentUser, login, logout } from 'api/user';
import { action, makeObservable } from 'mobx';

import { RequestOptions, RequestStateEnum } from '../../types/request';
import Api from '../core/Api';
import { BaseRequestStore } from '../core/BaseRequestStore';

import { LoginProps, User } from './types';

export class UsersStore extends BaseRequestStore<User> {
  constructor() {
    super();

    makeObservable(this, {
      loginAction: action,
      logoutAction: action,
      currentUser: action,
    });
  }

  loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<User>({ store: this, method: login }).execResult();

    const config = {
      email: cfg.email.trim(),
      password: cfg.password.trim(),
    };

    sendRequest(config, options, cb);
  }

  logoutAction() {
    const sendRequest = new Api<User>({ store: this, method: logout }).execResult();

    sendRequest(null, { silent: true }, (err: any) => {
      if (!err) {
        this.resetStore(RequestStateEnum.READY);
      }
    });
  }

  currentUser(cfg?: {}, options?: RequestOptions, cb?: Function) {
    const sendRequest = new Api<User>({ store: this, method: currentUser }).execResult();

    sendRequest(cfg, { silent: false, ...options }, cb);
  }
}
