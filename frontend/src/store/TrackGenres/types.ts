import { TrackGenresViewEnum } from 'types/track';

export type TrackGenre = {
    id: number;
    name: string;
    value: string;
    countTracks: number;
};

export type TrackGenreParams = {
    visible?: boolean;
    view?: TrackGenresViewEnum;
};
