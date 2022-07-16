import { PaginationParams } from 'types/request';
import { Category } from 'types/track';

export type TrackGenreParams = {
    category: Category;
};

export type GetAllByParams = {
    category?: string;
    genre?: string;
    visible?: boolean;
} & PaginationParams;

export type AddTrackRating = {
    id: number;
};
