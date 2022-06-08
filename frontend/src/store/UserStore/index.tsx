import { action, makeAutoObservable, observable } from 'mobx';
import { RequestOptions, RequestStateEnum } from '../../types/request';
import { LoginProps, User } from './types';

export class UserStore {
    @observable
    state = RequestStateEnum.IDLE;

    @observable
    data: User = null;

    @observable
    list: string[] = [];

    @observable
    meta: any = {};

    @observable
    setState(newState: RequestStateEnum) {
        this.state = newState;
    }

    constructor() {
        makeAutoObservable(this);
    }

    @action
    async loginAction(cfg: LoginProps, options?: RequestOptions, cb?: Function) {
        setTimeout(() => {
            this.state = RequestStateEnum.READY;
        }, 1000);
        // const sendRequest = await new Api<User>({
        //     state: this.state,
        //     data: this.data,
        //     meta: this.meta,
        //     method: login
        // }).execResult();
        //
        // await sendRequest(cfg, options, cb);
        // this.state = RequestStateEnum.READY;
        // this.list.push('test');

    }
    // export const requestGetUserPatricipantsListEffect = (cfg, options = {}, cb) => {
    //     const requestParams = {
    //         action: requestGetUserPatricipantsListAction,
    //         method: getUsersParticipantsList,
    //     };
    //
    //     let sendRequest = Api.execBase(requestParams);
    //
    //     if (options.silent) {
    //         sendRequest = Api.execResult(requestParams);
    //     }
    //
    //     return sendRequest(cfg, options, cb);
    // };

    @action
    logoutAction() {
        this.data = null;
    }
}