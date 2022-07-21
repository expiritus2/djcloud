import { PaginationParams } from 'types/request';

export type TrackGenreParams = {
    visible?: boolean;
};

export type GetAllByParams = {
    category?: string;
    genre?: string;
    visible?: boolean;
} & PaginationParams;

export type AddTrackRating = {
    id: number;
};
