import { AxiosError } from 'axios';
import { showErrorMessage } from 'helpers/errors';
import { RequestOptions, RequestStateEnum } from 'types/request';
import { StoreData } from 'types/store';

interface IApiParams<D> {
    store: StoreData<D>;
    method: Function;
}

interface IRequest {
    cfg?: any;
    options: RequestOptions;
    cb?: Function;
}

interface IResponse extends IRequest {
    response: any;
    errors?: AxiosError[];
}

export default class Api<D> {
    store: StoreData<D>;

    method: Function | undefined;

    constructor({ store, method }: IApiParams<D>) {
        this.store = store;
        this.method = method;
    }

    execResult(): Function {
        return async (cfg: any = {}, options: RequestOptions = {}, cb: Function) => {
            const opts = { showError: true, silent: true, ...options };

            return this.execFunc({ cfg, options: opts, cb });
        };
    }

    async execFunc({ cfg, options, cb }: IRequest): Promise<void> {
        const { showError, ...opts } = options;

        if (!options.silent) {
            this.setPending();
        }

        try {
            const response = await this.method?.(cfg, opts);
            this.setData({ cfg: { ...cfg, ...response.meta }, response, options });

            if (typeof cb === 'function') {
                cb(null, response);
            }

            return response;
        } catch (err: any) {
            const config = {
                ...cfg,
                status: (err as AxiosError)?.response?.status,
                message: (err as AxiosError).message,
            };

            this.setError({
                cfg: config,
                response: err,
                errors: err?.response?.data?.errors,
                options,
            });

            if (typeof cb === 'function') {
                cb(err, null);
            }

            if (showError) {
                showErrorMessage(err);
            }

            throw err;
        }
    }

    setPending(): void {
        this.store.state = RequestStateEnum.PENDING;
    }

    setData({ cfg, response }: IResponse): void {
        this.store.state = RequestStateEnum.READY;
        this.store.data = response.data;
        this.store.meta = cfg;
    }

    setError({ cfg }: IResponse): void {
        this.store.state = RequestStateEnum.ERROR;
        this.store.data = null;
        this.store.meta = cfg;
    }
}
