import { Category, Genre } from 'types/track';

export type Track = {
  id: number;
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
  trackId: number;
};

export type AddTrackRatingDto = {
  trackId: number;
  rating: number;
};

export type GetTrackRatingDto = {
  trackId: number;
};
