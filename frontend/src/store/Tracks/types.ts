import { PaginationParams } from 'types/request';

export type TrackGenreParams = {
    visible?: boolean;
};

export type GetAllByParams = {
    categoryId?: number;
    genreId?: number;
    visible?: boolean;
    shuffle?: boolean;
} & PaginationParams;

export type SendToTelegramDto = {
    trackId: number;
};
