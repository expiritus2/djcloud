import { TrackEntity } from '../track.entity';

export type GetAllResponseDto = {
    data: (TrackEntity & { isDidRating: boolean; rating: number; countRatings: number })[];
    count: number;
};
