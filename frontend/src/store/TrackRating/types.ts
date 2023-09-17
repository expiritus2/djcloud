import { Category, Genre } from 'types/track';

export type Track = {
    id: string;
    title: string;
    visible: boolean;
    duration: number;
    category: Category;
    genre: Genre;
    createdAt: string;
    updatedAt: string;
};

export type TrackRating = {
    countRatings: number;
    isDidRating: boolean;
    rating: number;
    trackId: string;
};

export type AddTrackRatingDto = {
    trackId: string;
    rating: number;
};

export type GetTrackRatingDto = {
    trackId: string;
};
