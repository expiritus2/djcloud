export enum RequestStateEnum {
    IDLE = 'IDLE',
    PENDING = 'PENDING',
    READY = 'READY',
    ERROR = 'ERROR',
}

export type RequestOptions = {
    silent?: boolean;
    showError?: boolean;
};
