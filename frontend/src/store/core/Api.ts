import { showErrorMessage } from '../../helpers/errors';
import { AxiosError } from 'axios';
import { RequestOptions, RequestStateEnum } from '../../types/request';
import { StoreData } from '../../types/store';

interface IApiParams<D> {
    data: StoreData<D>;
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
    data: StoreData<D>;
    method: Function | undefined;

    constructor({ data, method }: IApiParams<D>) {
        this.data = data;
        this.method = method;
    }

    execResult(): Function {
        return async (cfg: any = {}, options: RequestOptions = {}, cb: (err: any, response: any) => void) => {
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
        } catch (err) {
            const config = {
                ...cfg,
                status: (err as AxiosError)?.response?.status,
                message: (err as AxiosError).message,
            };

            this.setError({
                cfg: config,
                response: err,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
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
        this.data.state = RequestStateEnum.PENDING;
    }

    setData({ cfg, response }: IResponse): void {
        this.data.state = RequestStateEnum.READY;
        this.data.data = response.data;
        this.data.meta = cfg;
    }

    setError({ cfg }: IResponse): void {
        this.data.state = RequestStateEnum.ERROR;
        this.data.data = null;
        this.data.meta = cfg;
    }
}