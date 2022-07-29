import { AxiosRequestConfig } from 'axios';

export enum RequestStateEnum {
    IDLE = 'IDLE',
    PENDING = 'PENDING',
    READY = 'READY',
    ERROR = 'ERROR',
}

export type RequestOptions = {
    silent?: boolean;
    showError?: boolean;
} & AxiosRequestConfig;

export enum SortEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type PaginationParams = {
    limit?: number;
    page?: number;
    sort?: SortEnum;
    field?: string;
    search?: string;
};

export type PaginatedItems<T> = {
    data: T[];
    count: number;
};
