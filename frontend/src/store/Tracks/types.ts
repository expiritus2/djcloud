import { PaginationParams } from 'types/request';

export type TrackGenreParams = {
    visible?: boolean;
};

export type GetAllByParams = {
    categoryId?: number;
    genreId?: number;
    visible?: boolean;
} & PaginationParams;

export type AddTrackRating = {
    id: number;
};
