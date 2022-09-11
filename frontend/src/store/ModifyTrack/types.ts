import { SortEnum } from 'types/request';
import { Category, File as TrackFile, Genre } from 'types/track';

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
    sort?: SortEnum;
};

export type RemoveTrackDto = {
    id: number;
};
