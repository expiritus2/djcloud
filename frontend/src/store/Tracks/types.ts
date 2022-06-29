import { PaginationParams } from '../../types/request';

export type TrackGenreParams = {
    category: string;
};

export type GetAllByParams = {
    category?: string;
    genre?: string;
    visible?: boolean;
} & PaginationParams;
