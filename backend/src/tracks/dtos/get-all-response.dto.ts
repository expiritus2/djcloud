import { TrackEntity } from '../track.entity';

export type TrackData = TrackEntity & { isDidRating: boolean; rating: number; countRatings: number };

export type GetAllResponseDto = {
    data: TrackData[];
    count: number;
};
