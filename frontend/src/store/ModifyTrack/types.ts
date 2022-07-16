import { Category, Genre, File as TrackFile } from 'types/track';

export type CreateTrackDto = {
    title: string;
    category: Category;
    genre: Genre;
    file: TrackFile;
};

export type UpdateTrackDto = {
    id: number;
    title: string;
    category: Category;
    genre: Genre;
    file: TrackFile;
};

export type UpdateVisibleTrackDto = {
    id: number;
    visible: boolean;
};

export type GetTrackDto = {
    id: number;
};

export type RemoveTrackDto = {
    id: number;
};
