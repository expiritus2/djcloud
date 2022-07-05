import { apiServer } from 'settings/web-services/api';
import { AddTrackRatingDto, GetTrackRatingDto, TrackRating } from 'store/TrackRating/types';

export const addRating = (cfg: AddTrackRatingDto) => {
    return apiServer.post<TrackRating>('/trackRatings/add', cfg);
};

export const getRating = (cfg: GetTrackRatingDto) => {
    return apiServer.get<TrackRating>(`/trackRatings/${cfg.trackId}`);
};
