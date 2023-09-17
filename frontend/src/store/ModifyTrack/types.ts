import { SortEnum } from 'types/request';
import { Category, File as TrackFile, Genre } from 'types/track';

export type CreateTrackDto = {
    title: string;
    category: Category;
    genre: Genre;
    file: TrackFile;
};

export type UpdateTrackDto = {
    id: string;
    title?: string;
    category?: Category;
    genre?: Genre;
    file?: TrackFile;
    archive?: boolean;
};

export type UpdateVisibleTrackDto = {
    id: string;
    visible: boolean;
};

export type GetTrackDto = {
    id: string;
    sort?: SortEnum;
};

export type RemoveTrackDto = {
    id: string;
};

export type ArchiveTrackDto = {
    id: string;
    archive: boolean;
};
