import { Category, Genre, File as TrackFile } from '../Tracks/types';

export type CreateTrackDto = {
    title: string;
    category: Category;
    genre: Genre;
    file: File;
};

export type UpdateTrackDto = {
    id: number;
    title: string;
    category: Category;
    genre: Genre;
    file: TrackFile;
};

export type GetTrackDto = {
    id: number;
};

export type RemoveTrackDto = {
    id: number;
};
